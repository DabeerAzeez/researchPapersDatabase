# Research Papers Interactive Database

 *by Dabeer Abdul-Azeez*



## Overview

This project contains code that was used for the development of certain subpages on the [new website](https://hoaretr.wixsite.com/hoarelab) for the Hoare Lab for Engineered Smart Materials (where I was on coop during summer 2020). This includes some Javascript for interactive databases of their publications and improved display of equipment pictures and team information as well as some Python scripts that were used to parse through files and export content appropriately to `.csv` files which could be imported directly into the Wix database collections that were used throughout the website.

### Preview of Research Papers Database
![](README.assets/ResearchPapers.gif)

*Note: This GIF was recorded during the development process of the website, so some items have changed. To see the most up-to-date, version, visit the links under **Key Features**!*



## Technologies Used

- JavaScript
- Wix Corvid API (for Wix websites)
  - see documentation here: https://www.wix.com/corvid/reference/api-overview/introduction


## Key Features
### [Research Papers](https://hoaretr.wixsite.com/hoarelab/research-papers) and [Patents](https://hoaretr.wixsite.com/hoarelab/patents) Databases
**Interactive databases for all research papers and patents published by the Hoare Lab since the year 2000**

- Allows for dynamic filtering of database collection items by a user-inputted search query
  - You can search for any piece of text contained within either the title or description of any item in the database collection (e.g. author name, publication title, publication year)
  - You can reset your search at any time
- Displays featured images from the publications and buttons with links to the online versions of the publications, so long as they are available
- Displays number of search results in text at the top of the page 
  - Text changes based on how many items are currently displayed as well as how many are available under the current search filter
  
### **[Our Team](https://hoaretr.wixsite.com/hoarelab/our-team)** Page
**Displays all current and former members of the Hoare Lab, with images displayed for current members**
- Easy-to-update backend Wix database from which the page reads from

### **[Equipment](https://hoaretr.wixsite.com/hoarelab/equipment)** Page
**Displays all equipment used by the Hoare Lab**
- Easy-to-update backend Wix database from which the page reads


