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

export {
    ColorSchemes, TopoJSONType, ColorSchemesType, getTopoJSON,
    CategoryChart, CategoryMonthsChart, StationChart,
    CategoryTimeChart, CategoryYearsChart, CompanyChart, ProductChart,
    GeoMapChart, PriceMonthsChart, CountryChart, CompanyShareChart
};