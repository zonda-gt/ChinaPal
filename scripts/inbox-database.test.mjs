import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("private storage, deduplication, optimistic edits and send reservations", async () => {
  const pg = await PGlite.create();
  try {
    await pg.exec(
      "create role anon; create role authenticated; create role service_role bypassrls;",
    );
    for (const file of [
      "202610150001_instagram_webhook_deliveries.sql",
      "202610160001_inbox.sql",
      "202610160002_inbox_profiles.sql",
      "202610190001_inbox_reply_assistant_v2.sql",
      "202610200001_inbox_briefs.sql",
      "202610220001_inbox_plans_questions.sql",
    ]) {
      const sql = await readFile(
        new URL(`../supabase/migrations/${file}`, import.meta.url),
        "utf8",
      );
      await pg.exec(sql);
      await pg.exec(sql); // Safe to reapply after an uncertain dashboard outcome.
    }
    await pg.exec(
      "insert into inbox_conversations(peer_id,username) values('123','test_customer');",
    );
    const message = {
      id: "m1",
      peer_id: "123",
      direction: "inbound",
      sent_at: new Date(Date.now() - 60000).toISOString(),
      text: "Hello",
      attachments: [],
      deleted: false,
      unavailable: false,
    };
    const store = (m) =>
      pg.query("select inbox_store_message($1::jsonb)", [JSON.stringify(m)]);
    await store(message);
    await store(message);
    assert.equal(
      (await pg.query("select count(*)::integer n from inbox_messages")).rows[0]
        .n,
      1,
    );
    await store({ ...message, deleted: true, text: "", attachments: [] });
    await store(message);
    assert.deepEqual(
      (await pg.query("select deleted,text from inbox_messages")).rows[0],
      { deleted: true, text: "" },
    );
    await store({ ...message, id: "m2" });
    const draft = (
      await pg.query(
        "insert into inbox_drafts(peer_id,body,context_id,edited_by) values('123','A helpful reply','m2','admin') returning id",
      )
    ).rows[0].id;
    await assert.rejects(
      pg.query(
        "insert into inbox_drafts(peer_id,body,edited_by) values('123','Duplicate','admin')",
      ),
      /duplicate key/,
    );
    const edits = await Promise.all(
      [1, 2].map((n) =>
        pg.query(
          "update inbox_drafts set body=$1,version=version+1 where id=$2 and version=1 returning id",
          [`Edit ${n}`, draft],
        ),
      ),
    );
    assert.equal(
      edits.filter((r) => r.rows.length).length,
      1,
      "Only one editor may win the same version",
    );
    await assert.rejects(
      pg.query("select inbox_claim_send($1,1,'admin')", [draft]),
      /Draft changed/,
    );
    await store({
      ...message,
      id: "m3",
      sent_at: new Date(Date.now() - 30000).toISOString(),
    });
    await assert.rejects(
      pg.query("select inbox_claim_send($1,2,'admin')", [draft]),
      /Conversation changed/,
    );
    await pg.query("update inbox_drafts set context_id='m3' where id=$1", [
      draft,
    ]);
    await pg.query("select inbox_claim_send($1,2,'admin')", [draft]);
    await assert.rejects(
      pg.query("select inbox_claim_send($1,2,'admin')", [draft]),
      /already pending/,
    );
    await assert.rejects(
      pg.query("select inbox_resolve_send('123',$1,false,'admin')", [draft]),
      /still be running/,
    );
    await pg.query(
      "update inbox_drafts set updated_at=now()-interval '3 minutes' where id=$1",
      [draft],
    );
    await pg.query("select inbox_resolve_send('123',$1,false,'admin')", [
      draft,
    ]);
    assert.equal(
      (await pg.query("select sending_draft_id from inbox_conversations"))
        .rows[0].sending_draft_id,
      null,
    );
    await pg.exec(
      "update inbox_messages set sent_at=now()-interval '25 hours';",
    );
    const old = (
      await pg.query(
        "insert into inbox_drafts(peer_id,body,context_id,edited_by) values('123','Too late','m3','admin') returning id",
      )
    ).rows[0].id;
    await assert.rejects(
      pg.query("select inbox_claim_send($1,1,'admin')", [old]),
      /window has closed/,
    );
    const security = (
      await pg.query(
        "select has_table_privilege('anon','inbox_messages','select') as anon_read, has_table_privilege('authenticated','inbox_messages','select') as user_read, has_function_privilege('anon','inbox_claim_send(uuid,integer,text)','execute') as anon_send",
      )
    ).rows[0];
    assert.deepEqual(security, {
      anon_read: false,
      user_read: false,
      anon_send: false,
    });
    const profileSecurity = (
      await pg.query(
        "select relrowsecurity as rls, has_table_privilege('anon','inbox_profiles','select') as anon_read, has_table_privilege('authenticated','inbox_profiles','select') as user_read, has_table_privilege('service_role','inbox_profiles','insert') as server_write from pg_class where oid='public.inbox_profiles'::regclass",
      )
    ).rows[0];
    assert.deepEqual(profileSecurity, { rls: true, anon_read: false, user_read: false, server_write: true });
    const generationSecurity = (
      await pg.query(
        "select relrowsecurity as rls, has_table_privilege('anon','inbox_ai_generations','select') as anon_read, has_table_privilege('authenticated','inbox_ai_generations','select') as user_read, has_table_privilege('service_role','inbox_ai_generations','insert') as server_write from pg_class where oid='public.inbox_ai_generations'::regclass",
      )
    ).rows[0];
    assert.deepEqual(generationSecurity, { rls: true, anon_read: false, user_read: false, server_write: true });
    const briefSecurity = (
      await pg.query(
        "select relrowsecurity as rls, has_table_privilege('anon','inbox_briefs','select') as anon_read, has_table_privilege('authenticated','inbox_briefs','select') as user_read, has_table_privilege('service_role','inbox_briefs','insert') as server_write from pg_class where oid='public.inbox_briefs'::regclass",
      )
    ).rows[0];
    assert.deepEqual(briefSecurity, { rls: true, anon_read: false, user_read: false, server_write: true });
    for (const table of ["inbox_questions", "inbox_plans"]) {
      const row = (
        await pg.query(
          `select relrowsecurity as rls, has_table_privilege('anon','${table}','select') as anon_read, has_table_privilege('authenticated','${table}','select') as user_read, has_table_privilege('service_role','${table}','insert') as server_write from pg_class where oid='public.${table}'::regclass`,
        )
      ).rows[0];
      assert.deepEqual(row, { rls: true, anon_read: false, user_read: false, server_write: true }, table);
    }
    await pg.exec("insert into inbox_questions(peer_id,text,owner,source) values('123','Which hotel in Shanghai?','customer','plan')");
    assert.deepEqual(
      (await pg.query("select status,include,urgent from inbox_questions")).rows[0],
      { status: "open", include: false, urgent: false },
    );
    await assert.rejects(
      pg.query("insert into inbox_questions(peer_id,text,owner,source) values('123','x','customer','robot')"),
      /check constraint/,
    );
    await pg.exec("insert into inbox_plans(peer_id) values('123')");
    await pg.exec("insert into inbox_briefs(peer_id) values('123')");
    assert.deepEqual(
      (await pg.query("select edits from inbox_briefs where peer_id='123'")).rows[0],
      { edits: [] },
      "A conversation can hold team edits before any AI brief exists",
    );
    assert.deepEqual(
      (await pg.query("select parts,staff_facts from inbox_drafts where id=$1", [old])).rows[0],
      { parts: [], staff_facts: "" },
      "Existing drafts keep working with no follow-up messages",
    );
    await pg.exec("set role anon");
    await assert.rejects(
      pg.query("select * from inbox_messages"),
      /permission denied/,
    );
  } finally {
    await pg.close();
  }
});

test("comment replies: one rule per keyword and post, each comment logged and claimed once", async () => {
  const pg = await PGlite.create();
  try {
    await pg.exec("create role anon; create role authenticated; create role service_role bypassrls;");
    const sql = await readFile(new URL("../supabase/migrations/202610300001_inbox_comment_replies.sql", import.meta.url), "utf8");
    await pg.exec(sql);
    await pg.exec(sql); // Safe to reapply.
    const rule = (media) =>
      pg.query("insert into inbox_comment_rules(media_id,keyword,message) values($1,'china','Here is the itinerary') returning id", [media]);
    const all = (await rule(null)).rows[0].id;
    await assert.rejects(rule(null), /duplicate key/, "the same keyword twice for every post");
    await rule("111");
    await assert.rejects(rule("111"), /duplicate key/);
    await assert.rejects(pg.query("insert into inbox_comment_rules(keyword,message) values('','x')"), /check constraint/);
    const log = () =>
      pg.query(
        "insert into inbox_comment_replies(comment_id,media_id,rule_id,commenter_id,commented_at) values('180','111',$1,'555',now()) on conflict (comment_id) do nothing returning comment_id",
        [all],
      );
    assert.equal((await log()).rows.length, 1);
    assert.equal((await log()).rows.length, 0, "a webhook retry logs nothing new");
    const claims = await Promise.all(
      [1, 2].map(() => pg.query("update inbox_comment_replies set status='sending' where comment_id='180' and status in ('pending') returning comment_id")),
    );
    assert.equal(claims.filter((r) => r.rows.length).length, 1, "only one sender claims a comment");
    await assert.rejects(pg.query("update inbox_comment_replies set status='done'"), /check constraint/);
    await pg.query("delete from inbox_comment_rules where id=$1", [all]);
    assert.equal((await pg.query("select rule_id from inbox_comment_replies")).rows[0].rule_id, null, "deleting a rule keeps the log");
    const grants = await pg.query(
      "select count(*)::integer n from information_schema.role_table_grants where table_name like 'inbox_comment_%' and grantee in ('anon','authenticated')",
    );
    assert.equal(grants.rows[0].n, 0, "browsers can't read or write comment tables");
  } finally {
    await pg.close();
  }
});
