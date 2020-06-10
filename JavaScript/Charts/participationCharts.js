let participationCharts = [];

function ParticipationChart(HTMLElementId, dataSet, labelSet, label) {

    this.HTMLElementId = HTMLElementId;
    this.dataSet = dataSet;
    this.labelSet = labelSet;
    this.label = label;
    participationCharts.push(this);

    this.getHTMLElementId = function() {
        return this.HTMLElementId;
    }

    this.getDataSet = function() {
        return this.dataSet;
    }

    this.getLabelSet = function() {
        return this.labelSet;
    }

    this.getLabel = function() {
        return this.label;
    }
}

function randomColor(brightness){
    function randomChannel(brightness){
      var r = 255-brightness;
      var n = 0|((Math.random() * r) + brightness);
      var s = n.toString(16);
      return (s.length==1) ? '0'+s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function createParticipationCharts() {

    participationCharts.clear();

    let participantNames = [];
    let participationByMessages = [];
    let participationByWords = [];
    let participationByLetters = [];
    let participationByDays = [];

    for (let participant of chat.getParticipantsArray()) {
        participantNames.push(participant.getName());
        participationByMessages.push(participant.getParticipationPercentageByMessages().toFixed(1));
        participationByWords.push(participant.getParticipationPercentageByWords().toFixed(1));
        participationByLetters.push(participant.getParticipationPercentageByLetters().toFixed(1));
        participationByDays.push(participant.getParticipationPercentageByDays().toFixed(1));
    }

    new ParticipationChart("participationChartByMessages", participationByMessages, participantNames, "Participation by messages in %");
    new ParticipationChart("participationChartByWords", participationByWords, participantNames, "Participation by words in %");
    new ParticipationChart("participationChartByLetters", participationByLetters, participantNames, "Participation by letters in %");
    new ParticipationChart("participationChartByDays", participationByDays, participantNames, "Participation by days in %");

    if (participationCharts[0].getLabelSet().length > 15) {
        printParticipationChartsForGroups();
    } else {
        printParticipationCharts();
    }
}

function printParticipationChartsForGroups() {

    let colors = new Colors(0);
    let dataSets = [];
    let backgroundColors = [];
    let participantsSection = document.getElementById("participants");
    let chartDiv = createHTMLElement(participantsSection, "div", "participationCharts");
    let element = createHTMLElement(chartDiv, "canvas", "participationChartCanvas");
    let htmlElement = element.getContext('2d');
    let parent = element.parentElement;
    parent.style.width = "100%";
    parent.style.height = participationCharts[0].getLabelSet().length*3 + "vh";


    for (let label of participationCharts[0].getLabelSet()) {
        backgroundColors.push(colors.getRGBAString(colors.generateRandomTriplet(), 0.5));
    }

    for (let participationChart of participationCharts) {
        dataSets.push({
                label: participationChart.getLabel(),
                data: participationChart.getDataSet(),
                backgroundColor: backgroundColors, 
            }
        );
    }

    new Chart(htmlElement, {
        type: "horizontalBar",
        data: {
            labels: participationCharts[0].getLabelSet(),
            datasets: dataSets
        },
        options: {
            title: {
                display: true,
                text: participationCharts[0].getLabel()
            },
            responsive: true,
            maintainAspectRatio: false, 
            legend: {
                display: true
            },
        }
    });
}

function printParticipationCharts() {

    let participantsSection = document.getElementById("participants");

    for (let participationChart of participationCharts) {
        
        let chartDiv = createHTMLElement(participantsSection, "div", "participationCharts");
        let element = createHTMLElement(chartDiv, "canvas", "participationChartCanvas");
        let htmlElement = element.getContext('2d');
        let legend = true; 

        new Chart(htmlElement, {
            type: "doughnut",
            data: {
                labels: participationChart.getLabelSet(),
                datasets: [{
                    label: participationChart.getLabel(),
                    data: participationChart.getDataSet(),
                    backgroundColor: [
                        'rgba(7, 94, 84, 0.5)',
                        'rgba(18, 140, 126, 0.5)',
                        'rgba(7, 94, 84, 0.5)'
                    ], 
                    borderColor: [
                        'rgba(7, 94, 84, 1)',
                        'rgba(18, 140, 126, 1)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                title: {
                    display: true,
                    text: participationChart.getLabel()
                },
                responsive: true,
                maintainAspectRatio: false, 
                legend: {
                    display: legend
                },
            }
        });
    }
}