// Copyright 2015-2020 Swim inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Spec, Test, Exam} from "@swim/unit";
import {Interpolator} from "@swim/interpolate";
import {Color} from "@swim/color";
import {Look, FeelVector} from "@swim/theme";

export class FeelVectorSpec extends Spec {
  @Test
  testEmpty(exam: Exam): void {
    const vector = FeelVector.empty();
    exam.equal(vector.size, 0);
  }

  @Test
  testOf(exam: Exam): void {
    const vector = FeelVector.of([Look.backgroundColor, "#000000"]);
    exam.equal(vector.size, 1);
    exam.equal(vector.get(Look.backgroundColor), Color.black());
  }

  @Test
  testInterpolate(exam: Exam): void {
    const a = FeelVector.of([Look.backgroundColor, "#000000"], [Look.opacity, 1]);
    const b = FeelVector.of([Look.backgroundColor, "#222222"], [Look.opacity, 0.8]);
    const interpolator = Interpolator.between(a, b);
    exam.equal(interpolator.interpolate(0), a);
    exam.equal(interpolator.interpolate(1), b);
    exam.equal(interpolator.interpolate(0.5),
               FeelVector.of([Look.backgroundColor, "#111111"], [Look.opacity, 0.9]));
  }
}
