/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { by, browser, element, ElementFinder, protractor } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
import { resolve } from 'dns';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const reportsIcon = '//mat-icon[contains(@ng-reflect-svg-icon,"reportsNotificationIcon")]//ancestor::button';
const FilterDD = './/mat-label[contains(.,"Filter")]';
const SearchInputField = "//input[@name='searchInput']";
const SearchButtonXpath = "//span[.='Search']";
const FilterOptionsXpath=".//span[@class='mat-option-text']";
const FilterselectedXpath=".//mat-select[@id='mat-select-2']";
const ClearSearchXpath="//span[.='Clear Search']";


export class DynamicReportsPhase2 {

  clickOnReportsIcon() {
    return new Promise((resolve) => {
       
      dashBoard.waitForElement();
      const ReportsIconButton = element(by.xpath(reportsIcon));
      ReportsIconButton.isDisplayed().then(function () {
        library.logStep("Reports Icon Displayed");
        library.clickJS(ReportsIconButton);
        library.logStep("Clicked on reports Icon");
        resolve(true);
      })
      


    });

  }

  VerifyFilterDDpresent() {
    return new Promise((resolve) => {

      const FilterDropDown = element(by.xpath(FilterDD));

      FilterDropDown.isDisplayed().then(function () {
        library.logStep("Filter Drop Down is displayed");
        resolve(true);
      }).catch(function () {
        library.logFailStep("filter drop down is nolt displayed");
        resolve(false);
      })



    });
  }

  ClickFliterDD(){

    const FilterDropDown = element(by.xpath(FilterDD));

    browser.wait(browser.ExpectedConditions.elementToBeClickable(FilterDropDown), 100000);
    library.clickJS(FilterDropDown)


  }

  VerifySearchFieldPresent() {
    return new Promise((resolve) => {

      const SearchField = element(by.xpath(SearchInputField));

      SearchField.isDisplayed().then(function () {
        library.logStep("search field is displayed");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Search field is not displayed");
        resolve(false);
      })



    });
  }
  EnterKeywordtoSearchfield(keyword){

    const SearchField = element(by.xpath(SearchInputField));
    SearchField.sendKeys(keyword);


  }

  VerifySearchButtonDisplayed() {

    return new Promise((resolve) => {

      const SearchButton = element(by.xpath(SearchInputField));

      SearchButton.isDisplayed().then(function () {
        library.logStep("search field is displayed");
        resolve(true);

      }).catch(function () {
        library.logFailStep("Search field is not displayed");
        resolve(false);

      })

    });


  }
 

  VerifyFiltersinFilterDD() {

    return new Promise((resolve) => {

      this.ClickFliterDD();
      const FilterList=[ 'Location And Department',
      'Instrument',
      'Control And Lot',
      'Analyte']

      const FilterOptions=element.all(by.xpath(FilterOptionsXpath));
      const filters=FilterOptions.getText().then(function(options){
        for(let i=0;i<4;i++){
          if(options[i] === FilterList[i])
          {
            library.logStep(FilterList[i]+" Verified" );
          }
          else{
            library.logFailStep( FilterList[i]+" Not Present" );
            resolve(false)

          }
        }
      });
      resolve(true);

      


    });

    


  }

  
  
  FilterSelect(Filter) {

    return new Promise((resolve) => {

      this.ClickFliterDD();

      const SelecetedFilterXpath=".//span[@class='mat-option-text'][contains(text(),'"+Filter+"')]";
      const FilterDropDown = element(by.xpath(FilterselectedXpath));

      const SelectFilter=element(by.xpath(SelecetedFilterXpath));
      library.clickJS(SelectFilter);

      FilterDropDown.getAttribute("ng-reflect-value").then(function(filterSelected){

        console.log(filterSelected.toUpperCase() + Filter.toUpperCase())
        if(filterSelected.toUpperCase()===Filter.toUpperCase()){
          library.logStep("Right Filter Selected");
          resolve(true);

        }
        else{
          library.logStep("Wrong Filter Selected");
          resolve(false);
        }

      })

    });
 }

 VerifySearchResultsDept(keyword) {
  const columnTexts = "//div[@class='category']//span[@class='mat-checkbox-label']";
  let result = false;
  const originalList: Array<any> = [];
  let count = 0;
  return new Promise((resolve) => {
    let i = 0;
    const ele = element.all(by.xpath(columnTexts));
    ele.isDisplayed().then(function () {
      ele.each(function (optText) {
        library.scrollToElement(optText)
        optText.getText().then(function (text) {
          originalList[i] = text.toUpperCase();
          i++;
        });
      }).then(function () {
        console.log(originalList)
        console.log(originalList.length)
        for (let j=1;j<originalList.length;j++) {
          if (originalList[j].includes(keyword.toUpperCase())) {
            count++;
          }
        }
        console.log(count === originalList.length-1);
        if (count === originalList.length-1) {
          resolve(true);
        }
        else {
          library.logFailStep("search functionality failed");
          resolve(false);
        }
      });
    });
  });
}

VerifySearchResults(Column,keyword) {
  const columnTexts = ".//div[@class='column']["+Column+"]//label/span";
  let result = false;
  const originalList: Array<any> = [];
  let count = 0;
  return new Promise((resolve) => {
    let i = 0;
    const ele = element.all(by.xpath(columnTexts));
    ele.isDisplayed().then(function () {
      ele.each(function (optText) {
        library.scrollToElement(optText)
        optText.getText().then(function (text) {
          originalList[i] = text.toUpperCase();
          i++;
        });
      }).then(function () {
        console.log(originalList)
        console.log(originalList.length)
        for (let j=1;j<originalList.length;j++) {
          if (originalList[j].includes(keyword.toUpperCase())) {
            count++;
          }
        }
        console.log(count === originalList.length-1);
        if (count === originalList.length-1) {
          resolve(true);
        }
        else {
          library.logFailStep("search functionality failed");
          resolve(false);
        }
      });
    });
  });
}



 VerifyFilterSelections(){

  return new Promise((resolve) => {

  this.FilterSelect("Location And Department").catch(function(){
    resolve(false);
  });

  this.FilterSelect("Instrument").catch(function(){
    resolve(false);
  });

  this.FilterSelect("Control And Lot").catch(function(){
    resolve(false);
  });

  this.FilterSelect("Analyte").catch(function(){
    resolve(false);
  });

  resolve(true);
})

 }

 EnterKeyword(keyword){

  return new Promise((resolve) => {

  const SearchField=element(by.xpath(SearchInputField));
  SearchField.sendKeys(keyword).then(function(){
    library.logStep("keyword Entered");
    resolve(true)
  }).catch(function(){
    library.logFailStep("keyword not Entered");
    resolve(false);
  })
})

 }

 VerifysearchButtonDisabled(){

  return new Promise((resolve) => {

    const searchButton=element(by.xpath(SearchButtonXpath));

    searchButton.getAttribute("ng-reflect-disabled").then(function(searchButtondisabled){
      console.log(searchButtondisabled)
      if(searchButtondisabled==="true"){
        library.logStep("Search button is disabled");
        resolve(true);
      }
      else{
        library.logStep("Search button is not Disabled");
        resolve(false);
      }
    })

})
 }

 VerifysearchButtonEnabled(){

  return new Promise((resolve) => {

    const searchButton=element(by.xpath(SearchButtonXpath));

    searchButton.getAttribute("ng-reflect-disabled").then(function(searchButtondisabled){
      console.log(searchButtondisabled)
      if(searchButtondisabled==="false"){
        library.logStep("Search button is enabled");
        resolve(true);
      }
      else{
        library.logStep("Search button is not Enabled");
        resolve(false);
      }
    })

})
 }

 ClikcClearSearch(){

  return new Promise((resolve) => {

    const ClearsearchButton=element(by.xpath(ClearSearchXpath));
    ClearsearchButton.isDisplayed().then(function(){

    })


})
 }

 VerifySearchButtonChangetoClearSearch(){

  return new Promise((resolve) => {

    const searchButton=element(by.xpath(SearchButtonXpath));
    const clearsearch=element(by.xpath(ClearSearchXpath));


    searchButton.isDisplayed().then(function(){
      library.logFailStep("Searchbutton still present")
      resolve(false);
    }).catch(function(){
      library.logStep("Search button is not present");
      clearsearch.isDisplayed().then(function(){
        library.logStep("Search button is changed to clear search");
        resolve(true);
      }).catch(function(){
        library.logFailStep("Clear search button not present");
      })
    })

})
 }

 
 VerifyClearSearchFunction(){

  return new Promise((resolve) => {

    const searchButton=element(by.xpath(SearchButtonXpath));
    const clearsearch=element(by.xpath(ClearSearchXpath));
    const FilterDropDown=element(by.xpath(FilterDD));
    const SearchField=element(by.xpath(SearchInputField));
    

    library.clickJS(clearsearch);

    FilterDropDown.getAttribute("ng-reflect-value").then(function(FilterValue){

      if(FilterValue==="0"){
        library.logStep("Filter Drop Down cleared");
      }
      else{
        library.logFailStep("Filter dropdown is not cleared");
        resolve(false)
      }
    })

    SearchField.hasAttribute("ng-reflect-model").then(function(){

      library.logFailStep("Keyword not cleared");
      resolve(false);
    }).catch(function(){
      console.log("keyword cleared");
      resolve(true);
    })
    
    


})

 }

 ClickSearchButton(){

  return new Promise((resolve) => {

    const searchButton=element(by.xpath(SearchButtonXpath));

    library.clickJS(searchButton);
      library.logStep("search button clicked");
      resolve(true);

  })
 }



 

  

  VerifySearchUIelements() {
    return new Promise((resolve) => {


      this.VerifyFilterDDpresent().then(function () {
        library.logStep("Filter dropdown Verified");


      }).catch(function () {
        
        library.logFailStep("FilterDDnot verified");
        resolve(false);
      })

      this.VerifySearchFieldPresent().then(function () {
        library.logStep("Search field Verified");


      }).catch(function () {
        
        library.logFailStep("Search field verified");
        resolve(false);

      })


      this.VerifySearchButtonDisplayed().then(function () {
        library.logStep("Search field Verified");


      }).catch(function () {
        library.logFailStep("Search field verified");
        resolve(false);
        
      })

      resolve(true);



    
    
  });
  }



}


