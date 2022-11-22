/*jshint esversion: 6 */

const key="demo";
const city="Amsterdam";
const APIGW='https://weerlive.nl/api/json-data-10min.php?key='+key+'&locatie='+city;

var gaugeOptions = {

    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '70%',
            outerRadius: '105%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#0000FF'], // blue
            [0.3, '#DDDF0D'], // yellow
            [0.6, '#DF5353'] // red
        ],
        lineWidth: 1,
        minorTicks: true,
        tickAmount: 11,
        title: {
            y: -75
        },
        labels: {
            y: 5
        }
    },

    plotOptions: {
        solidgauge: {
            innerRadius: '85%',
            opacity: '60%',
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

var Cities = [4];

const app = document.getElementById('City_canvas');

var requestCityData  = new XMLHttpRequest();

requestCityData.onload = function drawCanvas () {

  // Begin accessing JSON data here

  var data = JSON.parse(this.response);
  cityCnt=0;

  if (requestCityData.status >= 200 && requestCityData.status < 400) {
    data.liveweer.forEach( Weer => {

        var chart;

        // when no chart for City, create one else just update based on IDs

        City=Weer.plaats;

        if( ( document.getElementById('card_'+City)) == null )
        {
            const card  = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('id', 'card_'+City );

            app.appendChild(card);  // add the card to the canvas

        // HEADER
            var header = document.createElement('h1');
            header.setAttribute('id', 'h1_'+City );
            header.textContent = City;
        // CHART
            const chartContainer = document.createElement('div');
            chartContainer.setAttribute("class","chart-container");
            chartContainer.setAttribute("id", 'container-'+City);
        
            card.appendChild(header);
            card.appendChild(chartContainer);
            
            var info_id = 'info_'+City;

            Cities[0] = Highcharts.chart('container-'+City, Highcharts.merge(gaugeOptions, {
                yAxis: {
                    min: -15,
                    max: 40
                    
                },
                
                credits: {
                    enabled: false
                },
                
                series: [{
                    name: 'C',
                    data: [Math.floor(20)],
                    dataLabels: {
                        format:
                            `<div class="actual_label">{y}&deg;C</div>`,
                        enabled: true,
                        y: 0
                    },
                    tooltip: {
                        valueSuffix: ' graden'
                    }
                },{
                    name: 'G',
                    data: [Math.floor(20)],
                    dataLabels: {
                        format:
                            `<div class="status_label" id=${info_id}>Samenvatting</div>`,     
                        enabled: true,
                        y: 25
                    },
                    innerRadius:'100%',
                    radius: '105%',
                    tooltip: {
                        valueSuffix: ' gevoelstemperatuur'
                    }
                }]
                
            }
            ));
            
    } 

    chart = Cities[cityCnt++];
    
    // update gauge with actual temperature

    var t = Math.floor(Weer.temp*10.0)/10.0;
    var g = Math.floor(Weer.gtemp*10.0)/10.0;

    chart.series[0].points[0].update(t);
    chart.series[1].points[0].update(g);
    
    // update status label
            
    label_text=Weer.samenv;

    div = document.getElementById ("info_"+City);
    div.innerHTML=label_text;
    });
  }   
};

function refreshCityData() {

    requestCityData.open('GET', APIGW, true);
    requestCityData.send();

}

refreshCityData(); // initial

var timer = setInterval(refreshCityData, 10*60 * 1000); // repeat every 15s
