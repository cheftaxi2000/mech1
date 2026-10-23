# Übung 2 — «LGS & Gaussian Elimination» (annotated slides, 39 pp., 25 Sept 2026)

Slide numbers = PDF pages. Handwriting is the TA's. «LGS» = lineares Gleichungssystem.

- **1** title. **2** overview map (see U01). **3** updates (skipped).
- **4 WARM UP — Which eqs. are linear?** ✓ x₁ + 18x₂ − 3x₃ + 5x₄ = 6 · ✗ x₁ + x₂ + x₃ = cos(x₁) · ✓ sin(8)x₁ + 3x₂ + 5x₃ = 0 · ✗ −x + x·y + z = 3.
- **5 Linear Equation.** Plot of 4x + 6y = 10: «The solutions to this linear equation would be any point on this line».
- **6 What is a system of linear equations really?** («lineares Gleichungssystem» (LGS)). ½x + y = 2 and 3x − 2y = 1 as two lines; «Intersection point solves system!».
- **7–10 Number of Solutions.** Three systems side by side: (2x+3y=5, 3x−2y=0) — lines intersect in one point; (2x+3y=5, 4x+6y=10) — «Same eq. but factor 2», «lines overlapping» (infinitely many); (2x+3y=5, 4x+6y=5) — «parallel» (none). Built up over four slides (7 equations only, 8 first plot, 9 second, 10 third).
- **11–12 Combining Equations — Visualized.** «What happens if we plot these?» E₁: 2x+3y=5 (red), E₂: x−2y=−1 (blue); E₁+E₂: 3x+y=4; −E₁+E₂: −x−5y=−6; 3E₁+E₂: 7x+7y=14. All new lines pass through the same point — «Still the same intersection!» (that point is (1, 1)).
- **13 Combining Equations — Algebraically.** E₁: 2x₀+3y₀=5, E₂: x₀−2y₀=−1 («point (x₀, y₀) solves system»); E₁+E₂ = (2x₀+3y₀)+(x₀−2y₀) = 4 since the brackets are 5 and −1; «So 3x+y=4 must also intersect (x₀, y₀)!».
- **14–15 Simplifying to Solve.** E₁: x−2y=−2, E₂: x+y=2. E₁−E₂: −3y=−4 (horizontal line); E₁+2·E₂: 3x=2 (vertical line); the intersection stays.
- **16 3D.** Three planes eq1: x+y+z=3, eq2: x−2y+3z=4, eq3: 2x+y−z=1 meeting in one point («Intersection»); «Check out Geogebra for more».
- **17–19.** «What will this look like?» (x+y+z=3,5,7) three parallel planes; (x+y+z=3, x+y+z=5, x+y−z=−2) two parallel planes cut by a third; both: «No intersection of all 3 planes ⇒ No Solution!».
- **20 Infinitely many Solutions.** x+y+z=3, 2x+2y+2z=6, 3x+3y+3z=9 — «Planes overlapping». «Can there still be infinite solutions if the planes don't overlap?»
- **21 YES!** x+y=2, x+2y=2, x−y=2: «∞ solutions but on a line» (the common line is x=2, y=0).
- **22–24 Simplification Process** (three build slides). eq1: −x+y+z=3, eq2: x+y+2z=5, eq3: x+y−z=1 → replace eq3 by eq4: −3z=−4 (horizontal plane). The intersection point is unchanged. (From the equations: eq3 − eq2 = −3z = −4.)
- **25 Notations.** Standard form: 3x₁+2x₂−x₃=2, x₁−2x₂−2x₃=0, −2x₁+x₂+x₃=3. Matrix form (3 2 −1; 1 −2 −2; −2 1 1)(x₁,x₂,x₃)ᵀ=(2,0,3)ᵀ. «Erweiterte Matrix»: columns x₁ x₂ x₃ | 1 with the same numbers; «can be simplified» (drop the headers); «More on this next week!».
- **26 Gaussian Elimination — GOAL:** isolate variables from left to right to create steps. x₁+x₂+x₃=6, x₁+2x₂+x₃=8, 2x₁+3x₂+5x₃=23 → «simplify notation» → augmented matrix (1 1 1|6; 1 2 1|8; 2 3 5|23).
- **27–28 IDEA: Create steps** (two build slides). Circle the 1 in the top left: it is the **Pivot** («We want this row to only have zeros» is about the entries below; «We make this our "Pivot"»; «we'll look closer at pivots & free variables next week»). Red circled multiples −1 (row 2) and −2 (row 3). «It is important to note down the manipulations for Gaussian eliminations. This is my preferred method, but you'll also often see it noted like this:» II−I, III−2I next to the rows. Result (1 1 1|6; 0 1 0|2; 0 1 3|11). «We want to make this the only non-zero entry in the column» («only zeros in rest of column»).
- **29** Next step: pivot 1 in row 2, multiple −1 for row 3 → (1 1 1|6; 0 1 0|2; 0 0 3|9): **Row-echelon form** («Zeilen-Stufen Form»); equations x₁+x₂+x₃=6, x₂=2, 3x₃=9.
- **30 Reverse substitution** to solve for variables: 3x₃=9 → x₃=3; x₂+0·x₃=2 → x₂=2; x₁+x₂+x₃=6 → x₁=1. «So intersection is at (x₁,x₂,x₃)=(1,2,3)». «…or we could have continued with Gauss to get the reduced row-echelon form» («Vereinfachte Zeilen-Stufen Form»): (1 0 0|1; 0 1 0|2; 0 0 1|3) with the diagonal marked.
- **31 Possible Results.** Three generic echelon matrices with pivots (green *) and arbitrary entries (*), zeros below: **Unique Solution** (3 pivots), **Infinitely many solutions** (last row all zeros incl. right side), **No Solutions** (last row 0 0 0 | ≠0, «≠», «(≠0)»).
- **32 More columns than rows?** 2x₁+2x₂−x₃=2, x₁+x₂+3x₃=1 → (2 2 −1|2; 1 1 3|1)… handwritten (1 1 3|1; 2 2 −1|2) with multiple −2 → (1 1 3|1; 0 0 −7|0): «Still correct row-echelon form»; 7x₃=0 ⇒ x₃=0; x₁+x₂+3(0)=1 ⇒ x₁+x₂=1.
- **33–36 Solve:** (a) x₁+x₂=3, 2x₁−x₂=0 → (1 1|3; 2 −1|0), −2 → (1 1|3; 0 −3|−6): −3x₂=−6 ⇒ x₂=2, x₁+2=3 ⇒ x₁=1. (b) x₁+x₂=2, 2x₁+2x₂=5 → (1 1|2; 0 0|1): «0x₂≠0 — No Solutions!». (c) 3x+4y−2z=0, 2x−3y+4z=11, x−2y+3z=7 → matrix with rows (1 −2 3|7; 2 −3 4|11; 3 4 −2|0), −2, −3 → (1 −2 3|7; 0 1 −2|−3; 0 10 −11|−21), −10 → (1 −2 3|7; 0 1 −2|−3; 0 0 9|9): x₁=2, x₂=−1, x₃=1 (the slide labels the unknowns x, y, z in the system and x₁, x₂, x₃ in the answer box). (d) x₁+x₂+x₃=2, 2x₁+2x₂+2x₃=4, 3x₁+3x₂+3x₃=6: «Eqs. just multiples of each other» → (1 1 1|2; 0 0 0|0; 0 0 0|0): «Infinitely many solutions!» (the slide does not give the solution set).
- **37 Series 1 Tips.** Q1 simple solving of LGS; Q2 Gaussian elimination practice («don't repeat calculations» → write one table with x₁ x₂ x₃ | b₁ b₂ b₃, i.e. solve for several right-hand sides at once); Q3 try to visualise it («Can 2 planes intersect at a single point?»); Q4/Q5 MatLab.
- 38–39 kahoot, contact.

(Slides 25–36 = Gauss part, 4–24 = geometry part; these are the ranges cited in the lessons.)
