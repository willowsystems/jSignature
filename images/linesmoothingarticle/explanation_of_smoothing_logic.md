##  Yet another smoothing (curve-fitting) algorithm?

We needed a super-efficient, real-time line smoothing algorithm for [jSignature](http://willowsystems.github.com/jSignature/ "browser-based (JavaScript + Canvas) signature capture applet"). It captures the signature as vectors by storing pointer (mouse, finger, stylus) coordinates into "stroke" arrays. These can be rendered on document at high resolution using post-production line smoothing (de-noising (simplification) + curve fitting), but while the signature is captured, we need to show something pleasant on the screen that approximates the stroke movement and later-to-be-rendered image.

Traditional "wait till you have the entire sequence, then analyze" algorithms don't fit this real-time smoothing model. We needed a logic that would introduce no perceived lag between movement and stroke rendering. A lot of other "real-time" algorithms ride on top of "inertia" or "iterative least error" calculations. Most of these introduce an observable lag in rendering, and some introduces a minor, but noticeable re-rendering path corrections in tail of the stroke. Combined with CPU cycles spent on simulated variable stroke thickness the solutions offered out there were too inefficient for our intended use of jSignature in mobile browsers. 

A compounding problem with many published line smoothing algorithms is that they often require a advanced degree of skill and understanding to implement and maintain the smoothing algorithm. Since jSignature is an open-source component, understanding of the smoothing code by "average" code contributor was important for stability and maintainability of the project.

## Getting to efficient stroke smoothing algorithm

What we came up with is a computationally-efficient method of fitting Bezier curves between two points composed of _(a)_ holding vectors parallel to lines crossing the points surrounding the curves' junction point, and _(b)_ deriving the lengths of control point handles based on the angle formed at the junction point.

Holding the vectors of control points emanating from two curves' junction point as lying on the same line is not new, as that is the only way to force one Bezier curve flow into another without visible kink at the junction point. 

![Illustration 1: Demonstration of smooth junction between two Bezier curves](images/linesmoothingarticle/illustration1.png)

Equally not new, but less intuitive is the idea of holding these control points' vectors parallel to the line connecting the points immediately surrounding the targeted point. 

![Illustration 2: Demonstration of natural junction between two Bezier curves by aligning the control point vectors with outer points line](images/linesmoothingarticle/illustration2.png)

What we see a lot of variation in is the method of determining the length of the control points' vectors, leading to degree of rounding occurring at that point.  Many algorithms somehow infer the length of control points' vectors from the distances among the target point and the points immediately preceding and following it. But, in almost all of those cases the lengths of the control points' vectors are not affected by the angle formed at the target point. This often leads to unnatural bubbling around what otherwise should be sharp points in drawing strokes.

![Illustration 3: Demonstration of unnatural bubbling at junction between two Bezier curves by inflation of length of control point vectors](images/linesmoothingarticle/illustration3.png)

## Our efficient curve-fitting algorithm

What we have assembled is an efficient method of inferring the lengths of control points' vectors based on the angle formed at the two curves' junction point formed by two lines connecting Preceding, Junction and Following endpoints of the two curves. Together with alignment of the control point vectors with the line crossing the points directly surrounding the junction point, this forms a tremendously simple way of describing the sections of two curves forming a junction point.

![Illustration 4: Pertinent components for calculation of natural junction between two Bezier curves](images/linesmoothingarticle/illustration4.png)

We found that to achieve a natural, visually pleasing junction between two Bezier curves (let's call them _AB_ and _BC_), going from point A, connected at junction point _B_, and ending at point C, the lengths of the control points' vectors emanating from junction point _B_ (let's call these control point vectors _BtoCP2ofAB_ and _BtoCP1ofBC_) must be equal to

    ABCAngleDerivativeRatio x VectorLength

where  _VectorLength_ is separately the length of vector _AB_ and _BC_ (for vectors _BtoCP2ofAB_ and _BtoCP1ofBC_ respectively), and where _ABCAngleDerivativeRatio_  is derived as

    | ABCAngle | x ( LimitTop - LimitBottom )  + LimitBottom 

where _ABCAngle_ is the angle between _BA_ and _BC_ vectors measured in PI and is in the range from -1 to +1, and where _LimitTop_ and _LimitBottom_ are ratios in a certain range. 

There, LimitBottom establishes the minimum length of a control point handle as a percentage of length of a curve that control point handle describes, and LimitTop establishes the maximum length of such a control point handle.

We deem such range from about 35% (0.35) to about 10% (0.10) to be most pleasing to the eye when pointing device capture units approximately equal rendering units (i.e. mouse movement detection VS. screen pixels). We recommend to lower the LimitBottom ratio to about 2% (0.02) when, before rendering, captured strokes are to be scaled up to resolution higher than that of a capture device.

This algorithm for deriving the length of the control points emanating from the curves' junction point allows to achieve "natural," "pleasing" smoothing at the curves' junction that varies dynamically throughout other junction points on a path formed of multiple curves, while still allowing for permanent real-time rendering of all but last 2 curves in the path. Smoothing of the strokes in this manner does not introduce noticeable lag between the movement of the pointing device and the rendering of the stroke following it.

## De-noising (simplifying) the stroke before smoothing

One worthy addition to this algorithm is real-time de-noising of the curve endpoint data. Before the above algorithm is invoked, a filter may be introduced between the "pointer moved to point X" event generator and the above-mentioned curve fitting algorithm. In our current case, we do not convey the "pointer moved to point X" events to the rendering logic until the distance from prior curve's end-point exceeds 2 units (i.e. "browser pixels") of movement.

![Illustration 5: Example of aliasing that is avoided when close-lying points are removed prior to curve fitting](images/linesmoothingarticle/illustration5.png)

Diagonal movement over a square-unit grid may generate superfluous capture-device-induced noise (often referred to as 'aliasing artifacts').  Our ignoring of sub-2-capture-units movements allows the above-mentioned curve-fitting algorithm to do a better job of inferring the true intent of the pointing device's movement across the capture grid and to do a better job of representing that movement intents as rendered, smoothed, anti-aliased strokes.

## Efficient variable pen pressure simulation

Another additional improvement to the presentation of the rendered strokes is the use of asymmetric brush for painting of the strokes as an efficient, simple way to simulate variable pen pressure. 

![Illustration 6: Example of use of asymmetric painting brush for simulation of pressure-based stroke thickness variation](images/linesmoothingarticle/illustration6.png)

The best such asymmetric brush is an oval slanted diagonally and locked in that slant regardless of direction of the stroke. As a result, depending on the direction of the stroke, the width of the stroke automatically thickens or slims **consistently** with the direction of the stroke, simulating heavier or lighter pen pressure on down or sideways strokes. 

One very efficient way such asymmetric brush can be simulated on rendering interfaces where rendering of Bezier curves cannot be done with asymmetric brush of fixed orientation, is to shadow the original curve with another that is offset diagonally by some half of the stroke's width. Another, somewhat more demanding for the rendering device, way of simulating such asymmetric brush is to close the original and diagonally-offset curves into a shape and fill it with color. 

Artificial pressure stroke thickening algorithms based on inertia, or movement speed, or point sparsity were found by us as less efficient and, most-importantly, inconsistent, and thus, appearing unnatural, on similarly slanted strokes.


