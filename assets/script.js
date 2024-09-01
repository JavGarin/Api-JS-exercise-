const url = 'https://mindicador.cl/api/';

fetch(url)
    .then(response => response.json())
    .then(data => mostrarData(data))
    .catch(error => console.log(error));


const mostrarData = (data) => {
    console.log(data); 

    const amountInput = document.getElementById('amount');
    const currencySelect = document.getElementById('currency');
    const convertButton = document.getElementById('convert-button');
    const errorMessage = document.querySelector('.error-message');

    convertButton.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        const selectedCurrency = currencySelect.value;

        // validar entrada del usuario
        if (isNaN(amount) || amount <= 0) {
            errorMessage.textContent = "Por favor, ingrese un monto positivo.";
            return;
        }

        if (selectedCurrency === "0") {
            errorMessage.textContent = "Por favor, seleccione una moneda.";
            return;
        }

        // reset al mensaje de error
        errorMessage.textContent = "";

        // la conversión usando el valor correspondiente
        const currencyData = {
            "USD": data.dolar.valor,
            "EUR": data.euro.valor,
            "AUD": data.dolar_intercambio.valor,
            "BTC": data.bitcoin.valor,
            "COPPER": data.libra_cobre.valor,
            "UF": data.uf.valor,
            "UTM": data.utm.valor,
            "IVP": data.ivp.valor
        };

        const conversionRate = currencyData[selectedCurrency];

        // calculo el resultado
        if (conversionRate) {
            const result = amount / conversionRate;
            mostrarResultado(result, selectedCurrency);
            generarGrafico(data, selectedCurrency);  // se generará el gráfico de líneas
        }
    });
};

const mostrarResultado = (result, currency) => {
    const resultContainer = document.querySelector('.converter-container');
    let resultElement = document.getElementById('conversion-result');

    // si el elemento de resultado no existe, se creará uno
    if (!resultElement) {
        resultElement = document.createElement('p');
        resultElement.id = 'conversion-result';
        resultContainer.appendChild(resultElement);
    }

    resultElement.textContent = `Resultado: ${result.toFixed(2)} ${currency}`;
};

const generarGrafico = (data, currency) => {
    const ctx = document.getElementById('exchangeChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy(); // para evitar superposiciones
    }


    const fechas = ["2024-08-21", "2024-08-22", "2024-08-23", "2024-08-24", "2024-08-25", "2024-08-26", "2024-08-27", "2024-08-28", "2024-08-29", "2024-08-30"];
    const valores = {
        "USD": [917.38, 916.5, 915.2, 914.3, 912.8, 911.9, 910.4, 909.2, 908.1, 907.5],
        "EUR": [1016.37, 1015.0, 1013.7, 1012.8, 1011.3, 1010.1, 1008.8, 1007.7, 1006.5, 1005.4],
        "AUD": [758.87, 758.0, 757.5, 757.0, 756.5, 756.0, 755.5, 755.0, 754.5, 754.0],
        "BTC": [59466.82, 59300.0, 59100.0, 59000.0, 58900.0, 58800.0, 58700.0, 58600.0, 58500.0, 58400.0],
        "COPPER": [4.14, 4.13, 4.12, 4.11, 4.10, 4.09, 4.08, 4.07, 4.06, 4.05],
        "UF": [37745.97, 37740.0, 37735.0, 37730.0, 37725.0, 37720.0, 37715.0, 37710.0, 37705.0, 37700.0],
        "UTM": [65901, 65900, 65899, 65898, 65897, 65896, 65895, 65894, 65893, 65892],
        "IVP": [39182.98, 39180.0, 39178.0, 39176.0, 39174.0, 39172.0, 39170.0, 39168.0, 39166.0, 39164.0]
    };

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: `Valor de ${currency} en los últimos 10 días`,
                data: valores[currency],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1 // línea recta sin curva
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha',
                        color: '#ffffff',
                    },
                    ticks: {
                        color: '#ffffff',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor en CLP',
                        color: '#ffffff',
                    },
                    ticks: {
                        color: '#ffffff',
                    },
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
};
