CRUD Project Template
=================

[![Build Status](https://travis-ci.org/buzzo/js-rest-crud.svg?branch=master)](https://travis-ci.org/buzzo/js-rest-crud)
[![Coverage Status](https://img.shields.io/coveralls/buzzo/js-rest-crud.svg)](https://coveralls.io/r/buzzo/js-rest-crud)

# Description

A HTML + JS (boostrap, jquery and others) + backend java REST (wildfly 8.2.0). <br/>
Using latest version of java 8 <br/>
Acceptance tests using Geb (http://www.gebish.org) - spock + groovy + selenium

# Usage

The following commands will launch the tests with the individual browsers:
    
    ./gradlew clean assemble
    
Then:
    
    ./gradlew chromeTest
    ./gradlew firefoxTest
    ./gradlew phantomJsTest
    
Replace `./gradlew` with `gradlew.bat` in the above examples if you're on Windows.


