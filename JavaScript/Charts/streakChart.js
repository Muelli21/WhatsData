function createStreakChart(chatStreak, parentElement) {

    let chartDiv = createHTMLElement(parentElement, "div", "streakChart");
    let element = createHTMLElement(chartDiv, "canvas", "streakChartCanvas");
    let htmlElement = element.getContext('2d');

    let streaks = chatStreak[0];
    let type = chatStreak[1];
    let streakLengths = [];
    let labels = [];

    for (let streak of streaks) {
        streakLengths.push(streak.getStreakLength());
        let infoString = streak.getStartDate().getDDMMYYYYString() + " - " + streak.getEndDate().getDDMMYYYYString()
        labels.push(infoString);
    }

    let colors = new Colors(0);
    new Chart(htmlElement, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: type + " in days",
                data: streakLengths,
                backgroundColor: colors.getRGBAStringSetByIndex(0, 0.2),
                borderWidth: 0
            }]
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
                    },
                    ticks: {
                        display: false
                    }
                }]
            }
        }
    });
}