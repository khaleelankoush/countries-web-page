import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import * as convert from 'xml-js';
import * as fs from 'fs';
@Injectable()
export class CountriesService {
  create(createCountryDto: CreateCountryDto) {
    return 'This action adds a new country';
  }

  async findAll() {
    return `This action returns all countries`;
  }

  async findOne(countryName: string) {
    try {
      const axios = require('axios');
      const root = require.main.filename;
      const body = fs.readFileSync(
        `${root}/templates/getIso.xml`.replace(
          `\\dist\\main.js`,
          '\\src\\countries',
        ),
        'utf8',
      );
      const config = {
        headers: {
          'Content-Type': 'application/soap+xml',
        },
      };
      const data = await axios.post(
        'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL',
        body.replace('{{countryName}}', countryName),
        config,
      );
      return data.data.match(
        /(?<=<m:CountryISOCodeResult>).+?(?=<\/m:CountryISOCodeResult>)/g,
      )[0];
    } catch (error) {
      throw new BadRequestException('Ooops! something went wrong');
    }
  }
  async getCountryInfo(countryName: string) {
    try {
      countryName = countryName.charAt(0).toUpperCase() + countryName.slice(1);
      const countryCode = await this.findOne(countryName);
      const axios = require('axios');
      const root = require.main.filename;
      const body = fs.readFileSync(
        `${root}/templates/getCountry.xml`.replace(
          `\\dist\\main.js`,
          '\\src\\countries',
        ),
        'utf8',
      );
      const config = {
        headers: {
          'Content-Type': 'application/soap+xml',
        },
      };
      const data = await axios.post(
        'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL',
        body.replace('{{ISO}}', countryCode),
        config,
      );
      const obj = convert.xml2js(data.data);

      return obj.elements[0].elements[0].elements[0].elements.map((item) => {
        return {
          sISOCode: item.elements.find((it) => {
            return it.name === 'm:sISOCode';
          }).elements[0].text,
          sName: item.elements.find((it) => {
            return it.name === 'm:sName';
          }).elements[0].text,
          sCapitalCity: item.elements.find((it) => {
            return it.name === 'm:sCapitalCity';
          }).elements[0].text,
          sPhoneCode: item.elements.find((it) => {
            return it.name === 'm:sPhoneCode';
          }).elements[0].text,
          sContinentCode: item.elements.find((it) => {
            return it.name === 'm:sContinentCode';
          }).elements[0].text,
          sCurrencyISOCode: item.elements.find((it) => {
            return it.name === 'm:sCurrencyISOCode';
          }).elements[0].text,
          sCountryFlag: item.elements.find((it) => {
            return it.name === 'm:sCountryFlag';
          }).elements[0].text,
          Languages: item.elements
            .find((it) => {
              return it.name === 'm:Languages';
            })
            .elements.map((languages) => {
              return {
                sISOCode: languages.elements.find((it) => {
                  return it.name === 'm:sISOCode';
                }).elements[0].text,
                sName: languages.elements.find((it) => {
                  return it.name === 'm:sName';
                }).elements[0].text,
              };
            }),
        };
      })[0];
    } catch (error) {
      throw new BadRequestException();
    }
  }
  async update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  async remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
