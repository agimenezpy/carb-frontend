import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes';
import 'chartjs-plugin-datalabels';
import * as ChartGeo from 'chartjs-chart-geo';

import CategoryChart from './CategoryChart';
import CategoryMonthsChart from './CategoryMonthsChart';
import CategoryTimeChart from './CategoryTimeChart';
import CategoryYearsChart from './CategoryYearsChart';
import CompanyChart from './CompanyChart';
import ProductChart from './ProductChart';
import PriceMonthsChart from './PriceMonthsChart';
import CountryChart from './CountryChart';
import StationChart from './StationChart';
import GeoMapChart from './GeoMapChart';
import CompanyShareChart from './CompanyShareChart';
import ClientMixChart from './ClientMixChart';
import ProductsMixChart from './ProductsMixChart';

interface ColorSchemesType {
    [propName: string]: any;
}

interface TopoJSONType {
    [propName: string]: any;
}

class ColorSchemes {
    static getColorSchemes(): ColorSchemesType {
        return Chart["colorschemes"];
    }
}

function getTopoJSON() {
    return ChartGeo.topojson;
}

const formatter = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;

export {
    ColorSchemes, TopoJSONType, ColorSchemesType, getTopoJSON, formatter,
    CategoryChart, CategoryMonthsChart, StationChart,
    CategoryTimeChart, CategoryYearsChart, CompanyChart, ProductChart,
    GeoMapChart, PriceMonthsChart, CountryChart, CompanyShareChart, 
    ClientMixChart, ProductsMixChart
};