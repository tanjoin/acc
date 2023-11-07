const ACC_URL = "https://tanjoin.github.io/acc/campaign.json";

class Campaign {
    constructor(jsonObject) {
        if (jsonData) {
            this.id = jsonData.id;
            this.title = jsonData.title;
            this.description = jsonData.description;
            this.serviceTitle = jsonData.service_title;
            this.date = jsonData.date;
            this.on = jsonData.on;
            this.urls = jsonData.urls;
            this.img = jsonData.img;
        }
    }

    static async loadAcc() {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', ACC_URL, true);
            request.onload = () => {
                let data = JSON.parse(this.responseText);
                let campaigns = data.campaigns.map((data) => new Campaign(data));
                let serviceTitles = Object.fromEntries(
                    campaigns
                    .map((c) => c.serviceTitle)
                    .filter((title, i, self) => self.indexOf(title) === i)
                    .map((title) => [title, null])
                );
                resolve({ campaigns, serviceTitles });
            }
            request.send(null);
        });
    }
}

module.exports = Campaign;