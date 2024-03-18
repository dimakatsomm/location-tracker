import mongoose from 'mongoose';

import * as C from '../../constants';
import { Country } from '../models/country.model';
import countries from './countries.json';
import { exit } from 'process';

const resolvedCountries = countries.map(c => ({
    _id: c.code,
    name: c.name,
    capital: c.capital,
    region: c.region,
    language: c.language,
    currency: c.currency,
    flag: c.flag
}));

(async () => {
    try {
        await mongoose.connect(C.MONGOURI);
        const country = await Country.findOne({ _id: countries[0].code });
        console.log(country);
        if (!country) {
            await Country.insertMany(resolvedCountries);
        } else {
            console.log('Countries already exist.');
        }

        exit();
    } catch (e) {
        console.error(e);
        exit(1);
    }
})();
