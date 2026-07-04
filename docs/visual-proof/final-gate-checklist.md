# Final Visual Proof Gate Checklist

## Required reports

- [ ] `design-intent.lock.md` exists
- [ ] `evidence.md` exists
- [ ] `responsive-matrix.md` exists
- [ ] `token-ledger.json` exists
- [ ] `asset-ledger.md` exists
- [ ] `state-matrix.md` exists
- [ ] `content-stress-report.md` exists
- [ ] `defect-backlog.md` exists
- [ ] `impeccable-routing.md` exists

## Visual

- [ ] 1440x900 screenshot captured
- [ ] 1280x800 screenshot captured
- [ ] 1024x768 screenshot captured
- [ ] 768x1024 screenshot captured
- [ ] 430x932 screenshot captured
- [ ] 390x844 screenshot captured
- [ ] 360x800 screenshot captured
- [ ] No unintended horizontal overflow
- [ ] No module overlap
- [ ] No primary CTA clipping
- [ ] Mobile nav opens and closes
- [ ] Hero remains coherent above the fold
- [ ] Long English, Chinese, and German stress copy do not break layout

## Accessibility

- [ ] Axe critical violations = 0
- [ ] Axe serious violations = 0
- [ ] Focus-visible is visible
- [ ] Images have alt text or decorative treatment
- [ ] Normal text contrast >= 4.5:1
- [ ] Large text contrast >= 3:1

## Performance

- [ ] LCP <= 2.5s
- [ ] CLS <= 0.1
- [ ] Above-the-fold images are sized
- [ ] Reduced motion mode is checked when motion intensity > 3

## Handoff to Impeccable

- [ ] Every P0 has a recommended Impeccable command
- [ ] Every P1 has a recommended Impeccable command
- [ ] Routing starts with targeted fixes
- [ ] Routing ends with `/impeccable audit`
- [ ] Final command is `/impeccable polish`
