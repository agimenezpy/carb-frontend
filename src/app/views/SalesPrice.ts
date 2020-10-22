import Vue from 'vue';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--1">{{header}}</div>
            <div class="overflow-auto">
                <table class="table modifier-class">
                <thead>
                <tr>
                    <th>Producto</th>
                    <th v-for="(comp, idx) in companies">
                        <a class="tooltip modifier-class" :aria-label="comp">
                            <img :src="'http://gis.mic.gov.py/static/img/emb/' + logos[idx] + '_64.png'">
                        </a>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(prod, idx) in products">
                    <td><b class="font-size--3">{{prod}}</b></td>
                    <td v-for="(comp, jdx) in companies">{{ fmt(values[idx][jdx]) }}</td>
                </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
</div>`;

const SalesPrice = Vue.extend({
    name: "SalesPrice",
    template,
    props: {
        header: String,
        xclass: String
    },
    data() {
        return {
            companies: ["3 FRONTERAS", "3MG", "B&R", "COMPASA", "COPEG", "COPETROL", "CORONA", "ECOP SA", "ENEX", "FUELPAR", "HIDRONORTE", "INTEGRAL", "PETROBRAS", "PETROCHACO", "PETROMAX", "PETRON", "PETROPAR", "PETROSUR", "PUMA ENERGY"],
            products: ["GASOIL TIPO I  ", "GASOIL TIPO III", "NAFTA RON 97 S/A", "NAFTA RON 97 E10", "NAFTA RON 95", "NAFTA RON 90", "NAFTA RON 85", "ALCOHOL"],
            logos: ["3MG", "FRT", "BR", "CPA", "CPG", "CPT", "COR", "ECO", "ENX", "FLP", "HDN", "INT", "PTBR", "PCH", "PMX", "PTN", "PTP", "PSR", "PUM"],
            values: [
                ["N/A", 5450, 5450, 5450, 5450, 5450, 5450, "N/A", 5450, 5400, 5450, 5390, 6040, 5450, 5450, "N/A", 5450, 5390, 5550],
                ["N/A", 4530, 4530, 4530, 4530, 4530, 4530, "N/A", 4530, 4500, 4530, 4530, 4530, 4530, 4530, "N/A", 4530, 4530, 4530],
                ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"], 
                ["N/A", "N/A", 7550, "N/A", "N/A", 7550, "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", 7550, "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
                ["N/A", 5890, 6040, 5850, 6040, 6040, 6040, "N/A", 6040, 6000, 6040, 5890, 6040, 5890, 5940, "N/A", 6040, 5850, 6090],
                ["N/A", 5090, 5240, 5200, 5240, 5240, 5240, "N/A", 5300, 5200, 5240, 5090, 5240, 5090, 5140, "N/A", 5240, 5090, 5240],
                ["N/A", 4150, 4950, 4200, 4300, 4300, 4300, "N/A", 4330, 4250, 4300, 4150, 4300, 4150, 4300, "N/A", 4300, 4150, 4300],
                ["N/A", "N/A", 4840, "N/A", "N/A", 4200, "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", 4200, "N/A", "N/A", "N/A", "N/A"]
            ]
        };
    },
    methods: {
        fmt(value: any) {
            return (typeof value === "string") ? value : Intl.NumberFormat("es-PY").format(value * 1000).replace(".000", "");

        }
    }
});

export default SalesPrice;