# CAL-27 Credential and Deploy Access Contract

Date: 2026-04-14
Owner: CTO
Issue: [CAL-27](/CAL/issues/CAL-27)
Dependency: [CAL-16](/CAL/issues/CAL-16)
Related execution split: [CAL-28](/CAL/issues/CAL-28)

## Purpose

Define exact fields and permissions required to finish CAL-27 credential-dependent work without ambiguity.

## 1) Production Deploy Access (Railway)

Required permissions:
- Ability to view and edit production environment variables for the Calculator Thailand service.
- Ability to trigger/review production deploys and confirm runtime env values are applied.

Required production env fields:
- `PUBLIC_SITE_URL`
- `PUBLIC_GA4_MEASUREMENT_ID`
- `PUBLIC_ADSENSE_CLIENT_ID`
- `PUBLIC_ADSENSE_SLOT_BELOW_CALCULATOR`
- `PUBLIC_ADSENSE_SLOT_IN_CONTENT`
- `PUBLIC_ADSENSE_SLOT_SIDEBAR`
- `PUBLIC_ADSENSE_SLOT_STICKY_ANCHOR`

## 2) Scorecard Pipeline API Access (Google)

If running CSV mode only, these are optional.
If enabling direct API pull automation, these are required:

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`
- `GSC_SITE_URL` (must match verified Search Console property)
- `GA4_PROPERTY_ID`
- `ADSENSE_ACCOUNT_ID`

## 3) Product/Data Permissions

Required account access:
- Search Console: at least read access on `GSC_SITE_URL` property.
- GA4: at least read access on `GA4_PROPERTY_ID`.
- AdSense: at least read access on `ADSENSE_ACCOUNT_ID`.

## 4) Validation Command

Use this command to verify env completeness in the execution context:

```bash
npm run seo:check-access -- --mode all
```

Modes:
- `--mode deploy`
- `--mode pipeline`
- `--mode all`

## 5) Current CAL-27 Scope Clarification

- Route parity delivery has been moved to [CAL-28](/CAL/issues/CAL-28).
- CAL-27 remains focused on scorecard pipeline + credential-gated integration surfaces tied to [CAL-16](/CAL/issues/CAL-16).
