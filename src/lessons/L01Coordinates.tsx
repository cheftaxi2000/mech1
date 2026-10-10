import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { Choice, NumericAnswer, Predict } from '../components/Quiz';
import { CoordinateExplorer } from '../viz/CoordinateExplorer';
import { QuadrantTrap } from '../viz/QuadrantTrap';

const t = String.raw;

export default function L01Coordinates() {
  return (
    <article className="lesson">
      <p className="lede">
        Before we can talk about velocity, forces or rigid bodies, we need an unambiguous way to say <em>where</em> something is.
        This section of the lecture builds that language: a reference body, and three ways of attaching numbers to a position.
        Everything later in the course is written in this language.
      </p>

      <Section id="point" title="1. The material point and its motion">
        <Box kind="lecture" src={<Src p={3} />}>
          <ul>
            <li><De en="material system">Materielles System</De>: a set of material points.</li>
            <li>Position of a material point <M>M</M> at time <M>t</M>: <M>M(t)</M>, a geometric point in 3D space.</li>
            <li><De en="motion">Bewegung</De>: change of position as a function of time, <M>M(t_1),\ M(t_2),\ \dots</M></li>
            <li>To describe the position we need a <De en="rigid reference body">starrer Bezugskörper</De>: a body in which the distance between any two points is constant.</li>
          </ul>
        </Box>
        <Box kind="intuition">
          <p>
            A <em>material</em> point is a piece of matter small enough that its size does not matter for the question being asked
            — a planet on its orbit, a bead on a wire. It keeps its identity: <M>M(t_1)</M> and <M>M(t_2)</M> are the
            <em> same</em> piece of matter at two different places. A <em>geometric</em> point is just a location. So <M>M(t)</M> reads:
            “the location that the material point <M>M</M> occupies at time <M>t</M>”.
          </p>
          <p>
            Position is always <em>relative</em>. “Where is the coffee cup?” has a different answer for someone standing on the
            platform and for someone sitting in the moving train. The reference body is the thing you measure <em>from</em>; it must be rigid,
            otherwise your rulers would stretch while you measure.
          </p>
        </Box>
        <Box kind="supplement" title="Why rigid?">
          If the reference body deformed, two measurements of the same, motionless point could give different coordinates. Motion would then be
          partly an artefact of the measuring device. Rigidity guarantees that the axes keep their lengths and the angles between them.
          (Rigid bodies return as the main topic of chapter 3 — there they are the <em>objects</em> that move, here they are the <em>stage</em>.)
        </Box>
      </Section>

      <Section id="cartesian" title="2. Cartesian coordinates (kartesische Koordinaten)">
        <Box kind="lecture" src={<Src p={3} fig="Fig. 1.4, 1.7" />}>
          <M>{t`x'Ox,\ y'Oy,\ z'Oz`}</M>: directed, mutually orthogonal axes fixed in the reference body. The numbers <M>x, y, z</M> describe the
          position of <M>M</M> at time <M>t</M>. The motion of <M>M</M> is given by three scalar functions
          <MD>{t`x = F_x(t),\qquad y = F_y(t),\qquad z = F_z(t).`}</MD>
        </Box>
        <p>
          <b>Reading the notation.</b> <M>{t`x'Ox`}</M> names the straight line through <M>O</M>, oriented from the <M>{t`x'`}</M> side towards
          the <M>x</M> side. The coordinate <M>x</M> is the <em>signed</em> length <M>{t`\overline{OM_x}`}</M>, where <M>{t`M_x`}</M> is the foot of the
          perpendicular from <M>M</M> onto the <M>x</M>-axis (Fig. 1.4). Negative <M>x</M> means <M>{t`M_x`}</M> lies on the <M>{t`x'`}</M> side.{' '}
          <M>{t`M_{xy}`}</M> is the projection of <M>M</M> onto the <M>xy</M>-plane — we will use it constantly.
        </p>
        <p>
          <M>F_x</M> is the <em>function</em>, <M>x</M> its <em>value</em>. Writing <M>{t`x = F_x(t)`}</M> instead of just <M>x(t)</M> is the lecture's way of
          stressing this: a motion is a rule that assigns three numbers to every instant.
        </p>
        <h3>Coordinate lines (Koordinatenlinien)</h3>
        <p>
          Fig. 1.7 shows the lines <M>{t`\bar x, \bar y, \bar z`}</M> through <M>M</M>. A <b>coordinate line</b> is what you trace out when you
          let <em>one</em> coordinate vary and keep the other two fixed. For Cartesian coordinates these are straight lines parallel to the axes.
          This looks trivial now, but it is the key idea of the next section: the lecture defines basis vectors as unit vectors
          <em> tangent to the coordinate lines at M</em> <Src p={6} />. In cylindrical and spherical coordinates some coordinate lines are circles —
          and that is exactly where the extra terms in the velocity formulas will come from.
        </p>
      </Section>

      <Section id="cylindrical" title="3. Cylindrical coordinates (Zylindrische Koordinaten) ρ, φ, z">
        <Box kind="lecture" src={<Src p={'3–4'} fig="Fig. 1.8, 1.10" />}>
          <MD>{t`x = \rho\cos\varphi,\qquad y = \rho\sin\varphi,\qquad z = z`}</MD>
          and conversely
          <MD>{t`\rho = \sqrt{x^2+y^2},\qquad \varphi = \arctan\!\left(\frac{y}{x}\right),\qquad z = z.`}</MD>
          Trajectory: <M>{t`\rho = F_\rho(t),\ \varphi = F_\varphi(t),\ z = F_z(t)`}</M>.
        </Box>
        <p><b>Meaning of the three numbers.</b></p>
        <ul>
          <li><M>\rho</M>: distance of <M>M</M> from the <M>z</M>-<em>axis</em> (= length <M>{t`\overline{OM_{xy}}`}</M>). Not the distance from the origin!</li>
          <li><M>\varphi</M>: angle from the positive <M>x</M>-axis to the segment <M>{t`OM_{xy}`}</M>, measured in the <M>xy</M>-plane, counter-clockwise when looking down from <M>+z</M>.</li>
          <li><M>z</M>: identical to the Cartesian <M>z</M> — the height above the <M>xy</M>-plane.</li>
        </ul>
        <Derivation title="x = ρ cos φ, y = ρ sin φ">
          <ol>
            <li>Project <M>M</M> straight down to <M>{t`M_{xy}`}</M>. This does not change <M>x</M> or <M>y</M>, so we can work entirely in the <M>xy</M>-plane.</li>
            <li>In that plane, <M>O</M>, <M>{t`M_{xy}`}</M> and the foot of the perpendicular from <M>{t`M_{xy}`}</M> onto the <M>x</M>-axis form a right triangle with hypotenuse <M>\rho</M> and angle <M>\varphi</M> at <M>O</M>.</li>
            <li>Adjacent side <M>{t`= \rho\cos\varphi = x`}</M>, opposite side <M>{t`= \rho\sin\varphi = y`}</M>. Using signed cos/sin makes this hold in all four quadrants, not just the first.</li>
            <li>Inverse: Pythagoras gives <M>{t`\rho^2 = x^2+y^2`}</M>; dividing the two equations gives <M>{t`\tan\varphi = y/x`}</M>.</li>
          </ol>
          <p><b>Sanity check (limiting cases).</b> <M>{t`\varphi = 0`}</M>: <M>{t`(x,y) = (\rho, 0)`}</M>, on the positive <M>x</M>-axis ✓. <M>{t`\varphi = \pi/2`}</M>: <M>{t`(0,\rho)`}</M> ✓.</p>
        </Derivation>
        <Box kind="review" title="R-001 · φ = arctan(y/x) is only correct for x > 0">
          <p>
            <M>\tan</M> has period <M>\pi</M>, so <M>{t`\tan\varphi = y/x`}</M> cannot distinguish <M>\varphi</M> from <M>{t`\varphi+\pi`}</M>.
            The calculator's <M>\arctan</M> always answers in <M>{t`(-\tfrac{\pi}{2}, \tfrac{\pi}{2})`}</M>. For points with <M>{t`x<0`}</M> it is off by <M>\pi</M>,
            and for <M>{t`x = 0`}</M> it is undefined. The formula in the notes is the standard shorthand, with “choose the correct quadrant” left implicit.
            Correct version (supplement):
          </p>
          <MD>{t`\varphi = \begin{cases} \arctan(y/x) & x>0 \\ \arctan(y/x) + \pi & x<0 \\ \pi/2 & x = 0,\ y>0 \\ 3\pi/2 & x=0,\ y<0 \end{cases}\qquad(\text{then reduce to } [0,2\pi))`}</MD>
          <p>This is what <code>atan2(y, x)</code> computes. Try it:</p>
          <QuadrantTrap />
        </Box>
        <Box kind="supplement" title="Ranges and the special case on the z-axis">
          The usual convention, which the notes do not state explicitly, is <M>{t`\rho \ge 0`}</M>, <M>{t`0 \le \varphi < 2\pi`}</M>, <M>{t`z\in\mathbb{R}`}</M>.
          On the <M>z</M>-axis (<M>{t`\rho = 0`}</M>) every <M>\varphi</M> gives the same point, so <M>\varphi</M> is undefined there. Try it in the explorer below by setting <M>{t`\rho = 0`}</M>.
        </Box>
        <h3>Coordinate lines (Fig. 1.10)</h3>
        <ul>
          <li><b><M>\rho</M>-line</b> (<M>{t`\varphi, z`}</M> fixed): horizontal ray starting at the <M>z</M>-axis and passing through <M>M</M>.</li>
          <li><b><M>\varphi</M>-line</b> (<M>{t`\rho, z`}</M> fixed): horizontal <em>circle</em> of radius <M>\rho</M> around the <M>z</M>-axis — the circle drawn in Fig. 1.10.</li>
          <li><b><M>z</M>-line</b> (<M>{t`\rho, \varphi`}</M> fixed): vertical straight line through <M>M</M> (the <M>{t`\bar z`}</M> line in the figure).</li>
        </ul>
        <p>Name check: the <em>surface</em> <M>{t`\rho = \text{const}`}</M> is a cylinder around the <M>z</M>-axis — that is where the name comes from.</p>
      </Section>

      <Section id="spherical" title="4. Spherical coordinates (Sphärische Koordinaten) r, θ, ψ">
        <Box kind="lecture" src={<Src p={4} fig="Fig. 1.12" />}>
          <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi,\qquad z = r\cos\theta`}</MD>
          and conversely
          <MD>{t`r = \sqrt{x^2+y^2+z^2},\qquad \theta = \arctan\!\left(\frac{\sqrt{x^2+y^2}}{z}\right),\qquad \psi = \arctan\!\left(\frac{y}{x}\right).`}</MD>
          Trajectory: <M>{t`r = F_r(t),\ \theta = F_\theta(t),\ \psi = F_\psi(t)`}</M>.
        </Box>
        <Box kind="key" title="Notation in this course">
          The lecture calls the spherical azimuth <M>\psi</M> (not <M>\varphi</M>). Geometrically, <M>\psi</M> is the <em>same</em> angle as the cylindrical <M>\varphi</M>.{' '}
          <M>\theta</M> is measured from the <b>positive <M>z</M>-axis</b> down to <M>{t`\underline{OM}`}</M>, so <M>{t`0 \le \theta \le \pi`}</M>.
          Many physics and maths books use other letters or swap them — always check which angle is which before using a formula from elsewhere.
        </Box>
        <ul>
          <li><M>r</M>: distance of <M>M</M> from the <em>origin</em> <M>O</M>.</li>
          <li><M>\theta</M>: angle between <M>+z</M> and <M>{t`OM`}</M> (polar angle). <M>{t`\theta=0`}</M> is the “north pole”, <M>{t`\theta=\pi/2`}</M> the <M>xy</M>-plane, <M>{t`\theta=\pi`}</M> the “south pole”.</li>
          <li><M>\psi</M>: azimuth, as <M>\varphi</M> above.</li>
        </ul>
        <Derivation title="the spherical formulas from the cylindrical ones">
          <ol>
            <li>Look at the vertical plane that contains the <M>z</M>-axis and <M>M</M>. In it, <M>O</M>, <M>M</M> and the foot of the perpendicular from <M>M</M> onto the <M>z</M>-axis form a right triangle with hypotenuse <M>r</M> and angle <M>\theta</M> at <M>O</M>.</li>
            <li>Side along the <M>z</M>-axis: <M>{t`z = r\cos\theta`}</M>. Side perpendicular to it — this is exactly the distance from the <M>z</M>-axis: <M>{t`\rho = r\sin\theta`}</M>.</li>
            <li>Insert <M>{t`\rho = r\sin\theta`}</M> and <M>{t`\varphi = \psi`}</M> into <M>{t`x = \rho\cos\varphi,\ y = \rho\sin\varphi`}</M>:
              <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi.`}</MD></li>
            <li>Consistency check: <M>{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M> ✓.</li>
            <li>Inverse: from step 2, <M>{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M>.</li>
          </ol>
        </Derivation>
        <Box kind="review" title="R-001 (again) · θ = arctan(√(x²+y²)/z) fails for z < 0">
          <p>
            For a point below the <M>xy</M>-plane, e.g. <M>{t`(1,0,-1)`}</M>, the true <M>{t`\theta = 135^\circ`}</M> but <M>{t`\arctan(1/(-1)) = -45^\circ`}</M>.
            For <M>{t`z = 0`}</M> the fraction is undefined although <M>{t`\theta = 90^\circ`}</M> is perfectly fine.
            A form that never needs a quadrant correction (supplement): since <M>{t`\arccos`}</M> returns values in <M>{t`[0,\pi]`}</M> — exactly the range of <M>\theta</M> —
          </p>
          <MD>{t`\theta = \arccos\!\left(\frac{z}{r}\right),\qquad r > 0.`}</MD>
        </Box>
        <h3>Coordinate lines</h3>
        <ul>
          <li><b><M>r</M>-line</b>: ray from <M>O</M> through <M>M</M>.</li>
          <li><b><M>\theta</M>-line</b>: meridian — half of a great circle of radius <M>r</M> from the north to the south pole, through <M>M</M>.</li>
          <li><b><M>\psi</M>-line</b>: circle of latitude — horizontal circle of radius <M>{t`r\sin\theta`}</M> at height <M>{t`r\cos\theta`}</M>.</li>
        </ul>
        <Box kind="supplement" title="Geography analogy">
          On the globe, <M>\psi</M> is the longitude and <M>\theta</M> is the <em>co</em>-latitude, <M>{t`\theta = 90^\circ - \text{latitude}`}</M>.
          Zürich lies at about <M>{t`47.4^\circ`}</M> N, so <M>{t`\theta \approx 42.6^\circ`}</M>.
        </Box>
      </Section>

      <Section id="explorer" title="5. Explore: one point, three descriptions">
        <p>
          Move <M>M</M> with the sliders and switch between the systems. The point stays where it is; only its description changes.
          All three coordinate triples are shown live underneath. Watch which coordinate lines are straight and which are curved.
        </p>
        <CoordinateExplorer initialMode="cyl" />
        <ul className="tasks">
          <li>In cylindrical mode, change only <M>\varphi</M>. What curve does <M>M</M> follow? (This will be <em>Kreisbewegung</em>, p. 11.)</li>
          <li>In spherical mode, set <M>{t`\theta = 90^\circ`}</M>. Which plane are you in? What is <M>\rho</M> compared with <M>r</M>?</li>
          <li>Set <M>{t`\rho = 0`}</M>. Which coordinates lose their meaning?</li>
        </ul>
      </Section>

      <Section id="example" title="6. Worked example (supplement)">
        <p>Convert <M>{t`M = (x,y,z) = (-1,\ 1,\ \sqrt 2)`}</M> into cylindrical and spherical coordinates, then convert back as a check.</p>
        <ol className="steps">
          <li><b>Locate the point first.</b> <M>{t`x<0,\ y>0`}</M>: <M>{t`M_{xy}`}</M> is in the 2nd quadrant, so the azimuth must lie between <M>{t`90^\circ`}</M> and <M>{t`180^\circ`}</M>. <M>{t`z>0`}</M>: above the <M>xy</M>-plane, so <M>{t`\theta < 90^\circ`}</M>.</li>
          <li><M>{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M>.</li>
          <li><M>{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M> — 4th quadrant, contradicts step 1. Add <M>{t`180^\circ`}</M>: <M>{t`\varphi = 135^\circ = 3\pi/4`}</M>.</li>
          <li><M>{t`r = \sqrt{1+1+2} = 2`}</M>.</li>
          <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (consistent with step 1). <M>{t`\psi = \varphi = 135^\circ`}</M>.</li>
          <li><b>Check:</b> <M>{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M> ✓, <M>{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M> ✓, <M>{t`z = 2\cos45^\circ = \sqrt2`}</M> ✓.</li>
        </ol>
        <p>Result: <M>{t`(\rho,\varphi,z) = (\sqrt2,\ 3\pi/4,\ \sqrt2)`}</M>, <M>{t`(r,\theta,\psi) = (2,\ \pi/4,\ 3\pi/4)`}</M>. Habit worth keeping: <em>sketch the quadrant before using arctan.</em></p>
      </Section>

      <Section id="misconceptions" title="7. Typical misconceptions">
        <Box kind="misconception" title="“ρ and r are the same distance.”">
          <M>\rho</M> is the distance from the <M>z</M>-<em>axis</em>, <M>r</M> from the <em>origin</em>. They agree only in the <M>xy</M>-plane; in general <M>{t`\rho = r\sin\theta \le r`}</M>.
        </Box>
        <Box kind="misconception" title="“θ is measured up from the xy-plane.”">
          That would be the geographic latitude. In this course <M>\theta</M> is measured from the <M>+z</M>-axis; points below the <M>xy</M>-plane have <M>{t`\theta > 90^\circ`}</M>.
        </Box>
        <Box kind="misconception" title="“(ρ, φ, z) are the components of the position vector.”">
          <p>Coordinates are not vector components, and coordinate triples cannot be added like vectors. Counterexample: the points
            <M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> and <M>{t`(1, \pi, 0)`}</M> are <M>{t`(1,0,0)`}</M> and <M>{t`(-1,0,0)`}</M> in Cartesian coordinates; their vector sum is the origin, but “adding the triples”
            gives <M>{t`(2, \pi, 0)`}</M>, i.e. <M>{t`(-2,0,0)`}</M>. Wrong.</p>
          <p>The lecture returns to exactly this point on p. 11: in the cylindrical basis the position vector of a point on a circle is <M>{t`(R, 0, z_0)`}</M>, and the lecturer explicitly crosses out <M>{t`(R, \varphi(t), z_0)`}</M> as “Falsch!”. The reason is in the next lesson: the angle is hidden in the direction of <M>{t`\underline{e}_\rho(\varphi)`}</M>.</p>
        </Box>
        <Box kind="misconception" title="“arctan(y/x) always gives φ.”">Only for <M>{t`x>0`}</M> (R-001). Always check the quadrant.</Box>
      </Section>

      <Section id="check" title="8. Check your understanding">
        <Choice
          question={<>In cylindrical coordinates, which coordinate line through a point <M>M</M> (not on the <M>z</M>-axis) is a circle?</>}
          choices={[
            { text: <>the <M>\rho</M>-line</>, why: <>Varying <M>\rho</M> with <M>{t`\varphi, z`}</M> fixed moves <M>M</M> radially away from the axis — a straight ray.</> },
            { text: <>the <M>\varphi</M>-line</>, correct: true, why: <>Fixed <M>\rho</M> and <M>z</M>: all points at distance <M>\rho</M> from the axis at height <M>z</M> — a horizontal circle. This is why the velocity will pick up a <M>{t`\rho\dot\varphi`}</M> term (p. 10).</> },
            { text: <>the <M>z</M>-line</>, why: <>Varying only <M>z</M> moves <M>M</M> vertically — a straight line.</> },
            { text: 'none, all coordinate lines are straight', why: 'That is only true for Cartesian coordinates.' },
          ]}
        />
        <Choice
          question={<>What is the cylindrical angle <M>\varphi</M> of the point <M>{t`(x,y,z) = (0,-2,5)`}</M>, using the convention <M>{t`0 \le \varphi < 360^\circ`}</M>?</>}
          choices={[
            { text: <M>{t`-90^\circ`}</M>, why: <>Same direction, but outside the requested range. Add <M>{t`360^\circ`}</M>. (If an exercise uses <M>{t`(-180^\circ, 180^\circ]`}</M>, this would be the answer — always check the convention.)</> },
            { text: <M>{t`270^\circ`}</M>, correct: true, why: <>The point lies on the negative <M>y</M>-axis direction (projected), i.e. <M>{t`270^\circ`}</M> from <M>+x</M>. Note <M>{t`\arctan(y/x)`}</M> is undefined here because <M>{t`x = 0`}</M>.</> },
            { text: <M>{t`90^\circ`}</M>, why: <>That is the positive <M>y</M>-axis.</> },
            { text: 'undefined', why: <>Undefined only on the <M>z</M>-axis (<M>{t`\rho=0`}</M>). Here <M>{t`\rho = 2`}</M>.</> },
          ]}
        />
        <NumericAnswer
          question={<>Compute <M>r</M> for <M>{t`(x,y,z) = (2,-3,6)`}</M>.</>}
          value={7}
          explain={<><M>{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M>. Signs do not matter for distances.</>}
        />
        <NumericAnswer
          question={<>Compute <M>\theta</M> (in degrees) for <M>{t`(x,y,z) = (1,1,-\sqrt2)`}</M>.</>}
          value={135} unit="°" tol={0.005}
          explain={<><M>{t`r = 2`}</M>, <M>{t`\cos\theta = z/r = -\sqrt2/2`}</M>, so <M>{t`\theta = 135^\circ`}</M>. The naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> is wrong (R-001).</>}
        />
        <Predict
          prompt={<>Each coordinate system gets its name from a surface <em>“one coordinate = const”</em>. What surface is <M>{t`\theta = \text{const}`}</M>? And <M>{t`\theta = 90^\circ`}</M> in particular?</>}
          answer={<><M>{t`\theta = \text{const}`}</M> is a <b>cone</b> with apex <M>O</M> around the <M>z</M>-axis (half-opening angle <M>\theta</M>). For <M>{t`\theta = 90^\circ`}</M> the cone opens up into the <b><M>xy</M>-plane</b>. Compare: <M>{t`r = \text{const}`}</M> is a sphere (→ “spherical”), <M>{t`\rho = \text{const}`}</M> a cylinder (→ “cylindrical”).</>}
        />
      </Section>

      <Section id="connections" title="9. Where this leads">
        <ul>
          <li><b>Next (p. 5):</b> vectors, scalar and cross product, orthonormal bases. A position becomes a vector <M>{t`\underline r(t)`}</M>.</li>
          <li><b>pp. 6–7:</b> the cylindrical and spherical <em>bases</em> are unit vectors tangent to the coordinate lines from this lesson — so <M>{t`\underline e_\varphi`}</M> is tangent to the φ-circle.</li>
          <li><b>pp. 9–10:</b> because <M>{t`\underline e_\rho`}</M> turns when <M>\varphi</M> changes, velocity in cylindrical coordinates is <M>{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M>.</li>
          <li><b>p. 11 and p. 16:</b> circular motion is “only <M>\varphi</M> changes”; the lecture's proof that rigid rotation is circular motion is done in cylindrical coordinates.</li>
        </ul>
      </Section>
    </article>
  );
}
