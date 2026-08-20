# Security Policy

## Supported version

Only the latest tagged 3.x release receives security fixes.

## Reporting

Do not publish access tokens, child data, signing keys or exploitable details in
public issues. Contact the repository owner privately through the verified
contact method on their GitHub profile. Revoke any credential that has been
pasted into chat, logs or issues before continuing.

## Project boundaries

The app is local-first and has no production backend. The parent gate is an UX
control, not a cryptographic security boundary. Exported JSON backups are not
encrypted and must be stored securely.
