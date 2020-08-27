import codecs
import csv

with codecs.open('ResearchPapers.txt', encoding='utf-8', mode='r') as f:
    content = f.readlines()

with codecs.open('researchPapers.csv', encoding='utf-8', mode='w+') as research_csv:
    for i in range(0, len(content)-1, 3):  # Working in line groups of 3
        title = content[i].strip()
        citation = content[i+1].strip()

        _, title = title.split(". ", 1)

        research_csv_writer = csv.writer(research_csv, delimiter=',')
        research_csv_writer.writerow([title, citation])
