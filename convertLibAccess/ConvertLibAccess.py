"""
ConvertLibAccess.py
Parses through a csv file and replaces libaccess.mcmaster.ca publication links in one column with their original link.
"""

import csv
import codecs
import re

LIB_LINK = ".libaccess.lib.mcmaster.ca"  # part of the link to be removed
INPUT_FILE_NAME = "ResearchPapers.csv"
OUTPUT_FILE_NAME = "Converted.csv"

with codecs.open(INPUT_FILE_NAME, encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    headers = next(reader)  # Extract first row using next()

    pattern = re.compile("(\w+:\/{2})([\w-]+)(.+)")  # RegEx pattern to extract libAccess domain (second group)

    output_file = codecs.open(OUTPUT_FILE_NAME, encoding="utf-8", mode='w+')
    file_writer = csv.writer(output_file, delimiter=',')

    for row in reader:
        try:
            print(row[-2])
        except IndexError:  # Helped sort through errors which highlighted that there were extra newlines in the .csv
            print("Error: ", row)

        link = row[-2]

        if LIB_LINK in link:
            link = link.replace(LIB_LINK, '')
            extracted_groups = list(pattern.match(link).groups())  # list() to convert tuple to list (mutable)
            extracted_groups[-2] = extracted_groups[1].replace("-", ".")  # convert domain back to original
            link = "".join(extracted_groups)
            print("fixed link: ", link)

            row[-2] = link  # Replace old link in 'row' with the new one

        file_writer.writerow(row)

    output_file.close()

