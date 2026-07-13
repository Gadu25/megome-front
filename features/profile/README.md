# features/profile

Profile domain — display, edit, and manage all profile sub-sections.

| File | Purpose |
|------|---------|
| `schema.ts` | Zod validation schemas for profile, skill, education, experience, certificate |
| `components/TopProfile.tsx` | Profile header: avatar, name, bio, metadata |
| `components/ProfileSkill.tsx` | Skills display with progress bars |
| `components/RightContent.tsx` | Tabbed container for education/experience/projects/certificates |
| `components/ProfileForm.tsx` | Profile edit form (image upload, validation) |
| `components/SkillForm.tsx` | Skill CRUD (inline add/delete) |
| `components/EducationForm.tsx` | Education CRUD (inline add/delete) |
| `components/ExperienceForm.tsx` | Experience CRUD (logo upload, tech tagging) |
| `components/CertificateForm.tsx` | Certificate CRUD (image upload, credential fields) |
| `components/sections/` | Shared section UI (EmptyState, SectionCard, SectionHeaders) |
| `components/rightContents/` | Display components for each profile section tab |
