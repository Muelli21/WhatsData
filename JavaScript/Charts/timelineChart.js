function createTimelineCharts(timelines, parentElement) {

    let keys = getDatesCoveredByTimelines(timelines);
    let labelSet = [];
    let dataSets = [];
    let colors = new Colors(0);

    for (let key of keys) {
        labelSet.push(key.getMonthDayYearString());
    }

    for (let timeline of timelines) {

        let dateEntries = timeline[0];
        let dataSet = [];
        let index = colors.getIndexOfSubsequentColorSet();

        for (let key of keys) {
            let timelineKey = key.withoutTime();
            let time = timelineKey.getTime();
            let dateEntry = dateEntries[time];
            let numberOfMessages;

            if (dateEntry == null) {
                numberOfMessages = 0;
            } else {
                let messages = dateEntry.getMessages();
                numberOfMessages = messages.length;
            }

            dataSet.push(numberOfMessages);
        }

        dataSets.push({
            label: timeline[1],
            data: dataSet,
            backgroundColor: colors.getRGBAStringSetByIndex(index, 0.5),
            borderWidth: 0
        });
    }

    drawChart(labelSet, dataSets, parentElement);
}

function createTimelineChart(timeline, parentElement) {
 
    let dateEntries = timeline[0];
    let keys = Object.keys(dateEntries);

    let labelSet = [];
    let dataSet = [];

    for (let key of keys) {
        let date = new Date();
        date.setTime(key);
        let dateEntry = dateEntries[key];
        let messages = dateEntry.getMessages();
        let numberOfMessages = messages.length;

        labelSet.push(date.getMonthDayYearString());
        dataSet.push(numberOfMessages);
    }

    drawChart(labelSet, [{
        label: timeline[1],
        data: dataSet,
        backgroundColor: [
            'rgba(7, 94, 84, 0.5)',
        ],
        borderWidth: 0
    }], parentElement);

}

function drawChart(labelSet, dataSets, parentElement) {
    
    let element = createHTMLElement(parentElement, "canvas", "timelineChartCanvas");
    let htmlElement = element.getContext('2d');

    let chart = new Chart(htmlElement, {
        type: "line",
        data: {
            labels: labelSet,
            datasets: dataSets
        },
        options: {
            title: {
                display: true,
                text: "messages"
            },
            responsive: true,
            maintainAspectRatio: false, 
            legend: {
                display: true
            },
        }
    });
}

function getDatesCoveredByTimelines(timelines) {

    let earliestStartDate = null;
    let latestEndDate = null;

    for(let timeline of timelines) {
        let dates = Object.keys(timeline[0]);
        let startDate = dates[0];
        let endDate = dates[dates.length-1];

        if (earliestStartDate == null || startDate < earliestStartDate) {
            earliestStartDate = startDate;
        }

        if (latestEndDate == null || endDate > latestEndDate) {
            latestEndDate = endDate;
        }
    }


    let date1 = new Date();
    let date2 = new Date();
    date1.setTime(earliestStartDate);
    date2.setTime(latestEndDate);
    return getDatesInbetween(date1, date2);
}