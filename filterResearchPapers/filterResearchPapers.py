"""
A python file I used to extract research paper information from a text file and compile it into a .csv file (for
importing into the Wix database).
"""

import codecs
import csv

with codecs.open('ResearchPapers.txt', encoding='utf-8', mode='r') as f:
    content = f.readlines()

with codecs.open('researchPapers.csv', encoding='utf-8', mode='w+') as research_csv:
    for i in range(0, len(content)-1, 3):  # Working in groups of 3 lines of the text file at a time
        title = content[i].strip()
        citation = content[i+1].strip()

        _, title = title.split(". ", 1)

        research_csv_writer = csv.writer(research_csv, delimiter=',')
        research_csv_writer.writerow([title, citation])
