# Performance notes: size grid on Slow 4G

The size grid doesn’t move on a Slow 4G phone. It sits 400px from the top from first paint to the end of loading, with layout shift at 0 before and after. No layout fix was needed, because the photo, title and price already have fixed heights of 300, 50 and 50px, and no web font downloads. The repo is [nike-pegasus-43-pdp](https://github.com/utsav747/nike-pegasus-43-pdp), commit 54c6aea. It now has the Lighthouse CI config, a grid-movement check and a GitHub workflow. The workflow hasn’t run on GitHub yet.

Test conditions (your Slow 4G profile): 375x812 at 3x mobile, 150 ms round trip, 1,638.4 Kbps, 4x slower CPU.

Speed limits:

* Layout shift 0
* First paint under 1.8 s
* Largest paint under 2.5 s
* Blocking time under 200 ms
* Speed index under 3.4 s
* Performance score at least 90
* Grid movement 0px, buttons at least 44px

The run scored 97 to 100, with first paint around 0.65 s and largest paint around 1.75 s. Re-run the check once the real photo replaces the placeholder.
