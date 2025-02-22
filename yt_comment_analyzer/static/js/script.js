document.addEventListener("DOMContentLoaded", function () {
    const ctx1 = document.getElementById("vadarSentiment").getContext("2d");

    new Chart(ctx1, {
        type: "pie",  
        data: {
            labels: ["Red", "Blue", "Yellow", "Green"],
            datasets: [
                {
                    label: "Sample Data",
                    data: [25, 35, 20, 20], 
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
                    hoverOffset: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#fff", 
                    },
                },
            },
        },
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const ctx2 = document.getElementById("textblobSentiment").getContext("2d");

    new Chart(ctx2, {
        type: "pie",  
        data: {
            labels: ["Red", "Blue", "Yellow", "Green"],
            datasets: [
                {
                    label: "Sample Data",
                    data: [25, 35, 20, 20], 
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
                    hoverOffset: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#fff", 
                    },
                },
            },
        },
    });
});
