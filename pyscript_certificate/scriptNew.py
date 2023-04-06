import cv2
import os
from PIL import Image
import sys
import json

# Read data from the parent process
data = sys.stdin.read()

# Parse the JSON data into a Python object
student = dict(json.loads(data))


# student = {
#     "Roll No": 1911068,
#     "Name": "BHALEGHARE ADITYA DEEPAK",
#     "Branch": "COMPUTER ENGINEERING",
#     "Examination": " MAY 2022",
#     "Year and Semester": "THIRD YEAR SEMESTER-VI",
#     "Course code 1": "2UCC601",
#     "Course Title": "Subject 1",
#     "Marks": 7,
#     "Course code 2": "2UCC602",
#     "Course Title_1": "Subject 2",
#     "Marks_1": 72,
#     "Course code 3": "2UCC603",
#     "Course Title_2": "Subject 3",
#     "Marks_2": 10,
#     "Course code 4": "2UCE616",
#     "Course Title_3": "Subject 4",
#     "Marks_3": 67,
#     "Course code 5": "2UST613",
#     "Course Title_4": "Subject 5",
#     "Marks_4": 31,
#     "Course code 6": "2USHY04",
#     "Course Title_5": "Subject 6",
#     "Marks_5": 69,
#     "Course code 7": "2UCL601",
#     "Course Title_6": "Subject 7",
#     "Marks_6": 75,
#     "Course code 8": "2UCL602",
#     "Course Title_7": "Subject 8",
#     "Marks_7": 69,
#     "Course code 9": "2UCL616",
#     "Course Title_8": "Subject 9",
#     "Marks_8": 90,
#     "Course code 10": "2UCP601",
#     "Course Title_9": "Subject 10",
#     "Marks_9": 79
# }

nameLoc = (520, 525)
rollnoLoc = (520, 610)
branchLoc = (520, 690)
examinationLoc = (520, 775)
yearSemLoc = (520, 860)

courseCodeLoc1 = (320, 1070)
courseCodeLoc2 = (320, 1130)
courseCodeLoc3 = (320, 1190)
courseCodeLoc4 = (320, 1250)
courseCodeLoc5 = (320, 1310)
courseCodeLoc6 = (320, 1370)
courseCodeLoc7 = (320, 1430)
courseCodeLoc8 = (320, 1490)
courseCodeLoc9 = (320, 1550)
courseCodeLoc10 = (320, 1610)

courseTitleLoc1 = (670, 1070)
courseTitleLoc2 = (670, 1130)
courseTitleLoc3 = (670, 1190)
courseTitleLoc4 = (670, 1250)
courseTitleLoc5 = (670, 1310)
courseTitleLoc6 = (670, 1370)
courseTitleLoc7 = (670, 1430)
courseTitleLoc8 = (670, 1490)
courseTitleLoc9 = (670, 1550)
courseTitleLoc10 = (670, 1610)

marksLoc1 = (1030, 1070)
marksLoc2 = (1030, 1130)
marksLoc3 = (1030, 1190)
marksLoc4 = (1030, 1250)
marksLoc5 = (1030, 1310)
marksLoc6 = (1030, 1370)
marksLoc7 = (1030, 1430)
marksLoc8 = (1030, 1490)
marksLoc9 = (1030, 1550)
marksLoc10 = (1030, 1610)

font = cv2.FONT_HERSHEY_TRIPLEX
fontScale = 1
smallFontScale = 0.8
color = (68, 49, 33)
thickness = 1
lineType = cv2.LINE_AA

template = cv2.imread(fr'pyscript_certificate\template.png')

cv2.putText(template, student['Name'], nameLoc,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Roll No']), rollnoLoc,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Branch'], branchLoc,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Examination']).strip(
), examinationLoc, font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Year and Semester'],
            yearSemLoc, font, fontScale, color, thickness, lineType)

cv2.putText(template, student['Course code 1'], courseCodeLoc1,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 2'], courseCodeLoc2,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 3'], courseCodeLoc3,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 4'], courseCodeLoc4,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 5'], courseCodeLoc5,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 6'], courseCodeLoc6,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 7'], courseCodeLoc7,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 8'], courseCodeLoc8,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 9'], courseCodeLoc9,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course code 10'], courseCodeLoc10,
            font, smallFontScale, color, thickness, lineType)

cv2.putText(template, student['Course Title'], courseTitleLoc1,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_1'], courseTitleLoc2,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_2'], courseTitleLoc3,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_3'], courseTitleLoc4,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_4'], courseTitleLoc5,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_5'], courseTitleLoc6,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_6'], courseTitleLoc7,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_7'], courseTitleLoc8,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_8'], courseTitleLoc9,
            font, smallFontScale, color, thickness, lineType)
cv2.putText(template, student['Course Title_9'], courseTitleLoc10,
            font, smallFontScale, color, thickness, lineType)

cv2.putText(template, str(student['Marks']), marksLoc1,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_1']), marksLoc2,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_2']), marksLoc3,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_3']), marksLoc4,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_4']), marksLoc5,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_5']), marksLoc6,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_6']), marksLoc7,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_7']), marksLoc8,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_8']), marksLoc9,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Marks_9']), marksLoc10,
            font, fontScale, color, thickness, lineType)

rollno_name = str(student['Roll No']) + '_' + str(student['Name'])
cwd = os.getcwd()

if not cv2.imwrite(fr'{cwd}\pyscript_certificate\results\{rollno_name}.png', template):
    raise Exception("Could not write image!")
with Image.open(fr'{cwd}\pyscript_certificate\results\{rollno_name}.png') as img:
    img.convert('RGB').save(
        fr'{cwd}\pyscript_certificate\results\{rollno_name}.pdf', format='PDF', resolution=100.0)
os.remove(fr'{cwd}\pyscript_certificate\results\{rollno_name}.png')
