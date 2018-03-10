const Campaign = require('./campaign');
const info = require('./info');

var acc = {
  campaigns: [],
  serviceTitles: [],
  inverse: [],
  underway: []
};

const showRemovedInverseCampaignJson = () => {
  const now = new Date();
  for (var i = 0; i < acc.campaigns.length; i++) {
    const campaign = acc.campaigns[i];
    if (!campaign.isExpired(now)) {
      acc.underway.push(campaign);
    }
  }
};

window.onload = () => {
  info.getCampaigns((campaigns, serviceTitles) => {
    acc.campaigns = campaigns;
    acc.serviceTitles = serviceTitles
    showRemovedInverseCampaignJson();
    var p = document.createElement('pre');
    p.innerText = JSON.stringify({
      campaigns: acc.underway
    }, null, 2);
    p.id = 'result';
    p.className = 'clipboard';
    p.setAttribute("style", "margin:16px;");
    p.setAttribute('data-clipboard-target', '#result');
    document.getElementById('contents').appendChild(p);
    new ClipboardJS('.clipboard');
  });
};
