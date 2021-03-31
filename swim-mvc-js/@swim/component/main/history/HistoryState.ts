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

export interface HistoryStateInit {
  fragment?: string;

  permanent?: {[key: string]: string | undefined};

  ephemeral?: {[key: string]: string | undefined};
}

export interface HistoryState {
  readonly fragment: string | undefined;

  readonly permanent: {readonly [key: string]: string | undefined};

  readonly ephemeral: {readonly [key: string]: string | undefined};
}

/** @hidden */
export interface MutableHistoryState {
  fragment: string | undefined;

  readonly permanent: {[key: string]: string | undefined};

  readonly ephemeral: {[key: string]: string | undefined};
}
