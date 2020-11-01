import { LightningElement, api, wire, track } from "lwc";
import { getRecordUi } from "lightning/uiRecordApi";
export default class RecordUiAPI extends LightningElement {
  @api recordId;
  @api sObjectName;
  @track layoutData = [];
  @track pageLoaded = false;
  @wire(getRecordUi, {
    recordIds: "$recordId",
    layoutTypes: "Full",
    modes: "View",
  })
  record({ data, error }) {
    if (data) {
        // ADD YOUR CUSTOM OBJECT LOGIC IN ELSE-IF SINCE THE OBJECT API NAME IS COMING AS HARD-CODED IN JSON
        //IF ANYONE, FOUND A SOULTION. PLEASE FEEL FREE TO CREATE A PULLREQUEST
      if (this.sObjectName === "Case") {
        let key = Object.keys(data.layouts.Case); // DE-STRUCTURIE UNIQUE KEY IN THE JSON LAYOUT
        let layoutSections = data.layouts.Case[key[0]].Full.View.sections; //ARRAY OF SECTIONS INFORMATION
        this.getLayoutData(layoutSections); // MAKE IT A SEPERATE RE-USABLE FUNCTION FOR CODE-REDUCTION IN FUTURE
        this.pageLoaded = true;
      }
      else if(this.sObjectName === "Account"){
        let key = Object.keys(data.layouts.Account); // DE-STRUCTURIE UNIQUE KEY IN THE JSON LAYOUT
        let layoutSections = data.layouts.Account[key[0]].Full.View.sections; //ARRAY OF SECTIONS INFORMATION
        this.getLayoutData(layoutSections); // MAKE IT A SEPERATE RE-USABLE FUNCTION FOR CODE-REDUCTION IN FUTURE
        this.pageLoaded = true;
      }
    } else {
      //HANDLE YOUR ERROR
    }
  }
  getLayoutData(layoutSections) {
    let layoutData = [];
    layoutSections.forEach((section) => {
      let heading = section.heading;
      let sectionColumns = section.columns;
      let fields = [];
      section.layoutRows.forEach((row) => {
        let layoutItems;
        layoutItems = row.layoutItems;
        layoutItems.forEach((layoutItem) => {
          let layoutComponents;
          layoutComponents = layoutItem.layoutComponents;
          layoutComponents.forEach((layoutComponent) => {
            let field;
            if (layoutComponent.apiName != null) {
              field = {
                apiName: layoutComponent.apiName,
                key: layoutComponent.apiName,
                size: 12 / sectionColumns,
              };
              fields.push(field);
            }
          });
        });
      });
      if (fields.length > 0) {
        let obj = {
          heading: heading,
          sectionColumns: sectionColumns,
          fields: fields,
        };
        layoutData.push(obj);
      }
      this.layoutData = layoutData;
    });
  }
}
