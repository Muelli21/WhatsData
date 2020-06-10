function createPeakDayChart(peakDays, parentElement) {

    let element = createHTMLElement(parentElement, "canvas", "peakDayChartCanvas");
    let htmlElement = element.getContext('2d');

    let dataSets = [];
    let colors = new Colors(0);

    for (let peakDay of peakDays) {
        let messagesPerDay = peakDay[1];
        let origin = peakDay[2];
        let dataSet = Object.values(messagesPerDay);
        dataSets.push({
            label: 'Messages per day ' + origin,
            data: dataSet,
            backgroundColor: colors.getRGBAStringSetByIndex(0, 0.2),
            borderWidth: 0
        });
    }

    let peakDayForLabels = peakDays[0];
    let messagesPerDay = peakDayForLabels[1];
    let labelSet = Object.keys(messagesPerDay);

    new Chart(htmlElement, {
        type: 'bar',
        data: {
            labels: labelSet,
            datasets: dataSets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            legend: {
                display: true
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    }, 
                    scaleLabel: {
                        display: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        display: false
                    }
                }]
            }
        }
    });
}

function createPeakHourChart(peakHours, parentElement) {

    let element = createHTMLElement(parentElement, "canvas", "peakHourChartCanvas");
    let htmlElement = element.getContext('2d');

    let dataSets = [];
    let colors = new Colors(0);

    for (let peakHour of peakHours) {
        let messagesPerHour = peakHour[1];
        let origin = peakHour[2];
        let dataSet = Object.values(messagesPerHour);

        let index = colors.getIndexOfSubsequentColorSet();

        if (peakHours.length == 1) {
            index = 1;
        }

        dataSets.push({
            label: 'Messages per hour ' + origin,
            data: dataSet,
            backgroundColor: colors.getRGBAStringSetByIndex(index, 0.1),
            borderColor: colors.getRGBAStringSetByIndex(index, 0.7),
            borderWidth: 1
        });
    }

    new Chart(htmlElement, {
        type: 'radar',
        data: {
            labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h'],
            datasets: dataSets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true
            },
            scales: {
                display: false
            }
        }
    });
}

function createMostUsedWordsChart(mostUsedWords, parentElement) {

    let chartDiv = createHTMLElement(parentElement, "div", "mostUsedWordsChart");
    let element = createHTMLElement(chartDiv, "canvas", "mostUsedWordsChartCanvas");
    let htmlElement = element.getContext('2d');
    let label = mostUsedWords[2];

    let colors = new Colors(0);
    new Chart(htmlElement, {
        type: 'bar',
        data: {
            labels: mostUsedWords[0],
            datasets: [{
                label: label,
                data: mostUsedWords[1],
                backgroundColor: colors.getRGBAStringSetByIndex(0, 0.2),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    }, 
                    scaleLabel: {
                        display: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        display: false
                    }
                }]
            }
        }
    });
}