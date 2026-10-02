# From request to booked move

The website stores an accepted lead before attempting anything else. Each JSONL line has an ID, UTC timestamp, source, status and every form field. The notification includes a Vancouver-local timestamp too. Default file: /data/leads.jsonl. The Docker volume keeps it across container replacement. Back it up to owner-controlled storage; restrict access and decide the retention period before launch.

With all SMTP variables configured, the app immediately attempts the business notification and, if an email was supplied, a customer confirmation. Either email can fail without undoing the saved lead. The response metadata reports sent, failed or unconfigured. The UI does not show these operational details. There is no automatic retry queue in the app; the daily reconciliation below is required until n8n is enabled.

Confirmation email subject: “We received your moving quote request”. Body: “Thanks for contacting IWantToMove.ca. We’ll review your move and call within [[PLACEHOLDER: response time]] to confirm the details and give you a quote. Call 778-513-7503 if you need to reach us. Your move is not booked yet.” It contains no promotion.

## A file-based pipeline

New Lead → Contacted → Quote Sent → Follow-Up → Booked → Lost.

Keep leads.jsonl as the intake log. Record changes in a separate owner-controlled lead-status.jsonl, one line per change: leadId, status, changedAt, nextFollowUpAt and a short operational note. These are proposed record keys, not a deployed admin interface. Never commit either file. A spreadsheet imported locally from these two files is enough for the MVP; keep it private. Record why a lead was lost without collecting unnecessary personal details.

At the start and end of each working day, reconcile new records against notifications and the status file. Assign one person to each request. Contact within the approved response time. After a quote, ask when the person wants a follow-up; record that date. Mark Booked only after the business confirms the arrangement. Respect requests to stop contact. No SMS provider is installed; the scripts below are for manual use.

## Optional self-hosted n8n path (not installed or activated)

1. Website: Schedule trigger → read the private mounted JSONL file → parse complete lines → compare lead IDs with a private processed-ID file. Process only unseen IDs. Do not expose the lead volume over HTTP.
2. Persist a pending task by ID before notifying. SMTP Send Email → record delivery outcome; retry failures with bounded backoff. On restart, retry pending tasks. Disable the app’s email path only when the replacement is tested, otherwise deduplicate notifications to avoid sending twice.
3. Native forms: authenticated Meta Lead Ads trigger → retrieve answers with the owner’s Meta credentials → normalise into the same fields, with source `meta_instant_form` and Meta lead ID → validate → append to a separate private instant-form-leads.jsonl → notify business and send requested confirmation. Use Meta lead ID as the deduplication key. The website endpoint remains unchanged.
4. Feed status changes into lead-status.jsonl. A scheduled branch finds overdue follow-ups and presents them to the assigned person. Do not send unsolicited automated texts.
5. Reconcile Meta’s native lead count against the stored native IDs daily. Test a dropped connection, SMTP failure and workflow restart before enabling ads. Keep tokens in n8n credentials, never in exported workflow JSON or this repo.

## Exact scripts

Phone opening: “Hi, it’s IWantToMove.ca calling about your moving quote request. Is now a good time to go over the details?”

Confirm the move: “I have your move from [submitted origin] to [submitted destination]. Is that right? Let’s check the date, what’s coming with you, and any stairs or elevator bookings.” Bracketed field labels here are substitutions from the actual lead, not business claims.

Voicemail: “Hi, it’s IWantToMove.ca returning your moving quote request. You can reach us at 778-513-7503. Again, that’s 778-513-7503. Thanks.” Do not leave addresses or other move details.

First SMS, only in response to their request: “Hi, it’s IWantToMove.ca. We received your moving quote request. Is there a good time to call and go over the details? You can also reach us at 778-513-7503.”

After a missed call: “Hi, it’s IWantToMove.ca. We tried calling about your moving quote. Reply with a time that works for you, or call 778-513-7503. If you no longer need a quote, just let us know.”

Quote follow-up at the agreed time: “Hi, it’s IWantToMove.ca checking in about your moving quote. Is there anything you’d like to go over before deciding?”

Close-out: “Thanks for letting us know. We’ll close your request. All the best with your move.”
