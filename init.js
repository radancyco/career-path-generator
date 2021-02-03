var view = new Vue({
    el: '#app',
    data: {
        careerModel: {
            backgroundColor: 'FFFFFF',
            textColor: '000000',
            textBackground: 'FFFFFF',
            arrowColor: 'FFFFFF',
            arrowBackground: '000000',
            borderColor: '000000',
            removeArrowBackground: false,
            matchBorder: false,
            borderStyle: 'square',
            borderWidth: 4,
            fontFamily: 'Arial',
            rowCount: 0,
            columnCount: 0,
            rows: [],
        },

        jobTitlePlaceholder: 'Job Title',


        rowTemplate: {
            rowId: '',
            columnCount: 0,
            borders: {
                topBorderSegments: [
                    {
                        segmentHidden: false
                    }
                ],
                bottomBorderSegments: [
                    {
                        segmentHidden: false
                    }
                ],
                totalSegments: 16,
                numOfTopSegments: 1,
                numOfBottomSegments: 1,
                addTopBorder: false,
                addBottomBorder: false,
            },
            jobTitles: [],
        },

        borderSegmentTemplate: {
            segmentHidden: false
        },

        titleRowColumnTemplate: {
            columnId: '',
            invisibleColumn: false,
            nullColumn: false,
            isLinked: false,
            hideText: false,
            isLast: false,
            // mappings: [],
            jobTitle: {
                titleId: '',
                name: '',
                link: ''
            }
        },


    },
    methods: {
        addRow: function() {
            this.careerModel.rowCount++;

            this.careerModel.rows.push(copyObject(this.rowTemplate));
            this.careerModel.rows[this.careerModel.rows.length-1].rowId = 'r' + this.careerModel.rowCount;

            if(this.careerModel.rows[this.careerModel.rows.length-1].jobTitles.length == 0){
                this.addTitleColumn(this.careerModel.rows.length-1);
            }
        },
        deleteRow: function(rowIndex) {
            this.careerModel.rows.splice(rowIndex, 1);
        },
        setTopBorderSegments: function(rowIndex) {
            this.careerModel.rows[rowIndex].borders.topBorderSegments = [];

            for(var i=0; i<this.careerModel.rows[rowIndex].borders.numOfTopSegments; i++){
                this.careerModel.rows[rowIndex].borders.topBorderSegments.push(copyObject(this.borderSegmentTemplate));
            }
        },
        setBottomBorderSegments: function(rowIndex) {
            this.careerModel.rows[rowIndex].borders.bottomBorderSegments = [];

            for(var i=0; i<this.careerModel.rows[rowIndex].borders.numOfBottomSegments; i++){
                this.careerModel.rows[rowIndex].borders.bottomBorderSegments.push(copyObject(this.borderSegmentTemplate));
            }
        },
        nextIndex: function(rowIndex) {
            if(this.careerModel.rows.length <= rowIndex+1){
                return rowIndex;
            }
            return rowIndex+1;
        },
        addTitleColumn: function(rowIndex) {
            let currentRow = this.careerModel.rows[rowIndex];
            currentRow.columnCount++;

            let rowId = currentRow.rowId;
            let columnId = currentRow.columnCount;

            // push template to model
            currentRow.jobTitles.push(copyObject(this.titleRowColumnTemplate));

            let numOfJobTitles = currentRow.jobTitles.length;
            let addedColumn = currentRow.jobTitles[numOfJobTitles-1];

            //set job title placeholder
            addedColumn.jobTitle.name = this.jobTitlePlaceholder + ' ' + columnId;
            // set column id
            addedColumn.columnId = 'c' + columnId;

            // set job title id
            addedColumn.jobTitle.titleId = rowId + addedColumn.columnId;
        },
        deleteTitleColumn: function(rowIndex, itemIndex) {
            this.careerModel.rows[rowIndex].jobTitles.splice(itemIndex, 1);

            if(this.careerModel.rows[rowIndex].jobTitles.length == 1){
                this.careerModel.rows[rowIndex].borders.addTopBorder = false
                this.careerModel.rows[rowIndex].borders.addBottomBorder = false
            }
        },

        endPath: function(noText, lastPath) {
            if(lastPath) {
                return false;
            }
            if(noText) {
                return false;
            }

            return true;

        },
        calculateBorderWidth: function(numOfColumns) {
            let width = 100 - ((100 / (numOfColumns*2)) + (100 / (numOfColumns*2)));
            if(this.borderStyle == 'solid'){
                return width = 'calc(' + width + '% + ' + this.careerModel.borderWidth + 'px)'
            }
            return width + '%';
        },
        updateJobTitle: function(e, rowIndex, itemIndex) {
            this.careerModel.rows[rowIndex].jobTitles[itemIndex].jobTitle.name = e.target.value;
        },
        // listMappings: function(mappings) {
        //     let string = 'leads to ';

        //     if(mappings.length == 2){
        //         string += mappings[0] + ' or ' + mappings[1];
        //     } else if(mappings.length > 1){

        //         for(i=0;i<mappings.length;i++){
        //             if(i == mappings.length - 1){
        //                 string += 'or ' + mappings[i];
        //             } else {
        //                 string += mappings[i] + ', ';
        //             }
        //         }
        //     } else {
        //         string += mappings[0];

        //         if(string ==  'leads to ' || string ==  'leads to undefined'){
        //             string = '';
        //         }
        //     }

        //     return string;
        // },
        jobTitleWrapperStyle: function(invisible, remove) {
            let style = "";
            if(invisible) {
                style = "visibility: hidden"
            }
            if(remove) {
                style = "display: none"
            }
            style += "; padding-bottom: " + this.careerModel.borderWidth + "px; margin-top: -" + this.careerModel.borderWidth + "px";
            return style;
        },

        exportConfig: function() {
            let jsonBlob = new Blob([JSON.stringify(this.careerModel)], {
                type: "text/plain;charset=utf-8"
            });
            let filename = "path_config.json";

            saveAs(jsonBlob, filename);
        },
        importConfig: function(element) {
            let file = element.files[0];

            if(typeof file != 'undefined' && file.type == 'application/json') {
                let thisApp = this;
                let reader = new FileReader();

                reader.onload = function(e) {
                    thisApp.careerModel = JSON.parse(reader.result);
                    element.value = '';
                }

                reader.readAsText(file);
            } else {
                if(typeof file == 'undefined'){
                    alert('No file chosen!');
                } else {
                    alert('Please upload a .json file. \nThe current file is .' + file.name.split('.')[file.name.split.length-1])
                }
            }
        },
        removeStyle: function(el, numOfChildren){
            //only remove the unwanted inline styles, some must stay
            if((el.classList == '' && el.tagName.toLowerCase() == 'svg') || el.classList.contains('career-path__border-row')){
                // do nothing
            } else {
                el.removeAttribute('style');
            }

            for (let i = 0; i < numOfChildren; i++) {
                if(el.children != "undefined") {
                    this.removeStyle(el.children[i], el.children[i].children.length);
                }
            }
        },
        exportFiles: function() {
            //create zip file
            let zip = new JSZip();
            //clone career path
            let html = document.getElementById("career-path-template").cloneNode(true);
            html.removeAttribute("id");
            // html.id = "career-path";

            // remove all unwanted style attributes from clone
            this.removeStyle(html, html.children.length);

            // create text file from clone and replace all double quotes with single quotes
            let htmlBlob = new Blob([String(html.outerHTML).replace(/\"/g, "'").replace(/<!---->/g, "")], {
                type: "text;charset=utf-8"
            });
            
            //create text file for SCSS
            let scssBlob = new Blob([document.getElementById("path-scss").textContent], {
                type: "text;charset=utf-8"
            });

            // add text files to zip file
            zip.file("career_path_html.txt", htmlBlob);
            zip.file("career_path_scss.txt", scssBlob);

            //export zip file
            zip.generateAsync({type:"blob"}).then(function (content) {
                saveAs(content, 'code.zip');
            });
        },
        updateTextColor: function($event) {
            this.careerModel.textColor = $event.srcElement.value;
        },
        updateTextBackground: function($event) {
            this.careerModel.textBackground = $event.srcElement.value;
        },
        updateArrowColor: function($event) {
            this.careerModel.arrowColor = $event.srcElement.value;
        },

        updateArrowBackground: function($event) {
            this.careerModel.arrowBackground = $event.srcElement.value;
        },
        updateBorderColor: function($event) {
            this.careerModel.borderColor = $event.srcElement.value;
        },
        updateBackgroundColor: function($event) {
            this.careerModel.backgroundColor = $event.srcElement.value;
        },
    },
    computed: {

    }
});

function copyObject(object) {
    return JSON.parse(JSON.stringify(object));
}