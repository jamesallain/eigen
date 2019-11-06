/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type PartnerLocationSection_partner = {
    readonly slug: string;
    readonly name: string | null;
    readonly locations: ReadonlyArray<{
        readonly city: string | null;
    } | null> | null;
    readonly " $refType": "PartnerLocationSection_partner";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PartnerLocationSection_partner",
  "type": "Partner",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "locations",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "city",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '812505e385e7179d9a26c1325e7b7231';
export default node;
