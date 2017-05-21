"use strict";

import Campaign from './model/campaign';
import Day from "./model/day";

var campaign = new Campaign(`{
    "id": 175,
    "service": "セブンイレブン",
    "title": "揚げ物・フランクを一度に300円買うと対象のセブンプレミアムの惣菜無料引換券プレゼント！｜セブン‐イレブン～近くて便利～",
    "description": "実施期間2017年5月5日（金）・12日（金）・19日（金）・26日（金） \\n無料券引換期間2017年5月31日（水）まで\\n※5月5日（金）、12日（金）、19日（金）、26日（金）に発行された無料券共通の引換期間となります。\\n",
    "urls": [
        "http://www.sej.co.jp/cmp/hotsnack1705.html"
    ],
    "images": ["http://www.sej.co.jp/mngdbps/_template_/_user_/_SITE_/localhost/_res/cmp/hotsnack1705/main.jpg"],
    "event_period": {
      "start": "2017/05/18",
      "end": "2017/05/19"
    },
    "particular_days": ["Sun"]
}`);

console.log(new Campaign());
console.log(campaign);
console.log(Day.Sunday);
console.log(campaign.particularDays[0] === Day.Sunday);
