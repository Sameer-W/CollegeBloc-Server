import cv2
import pandas as pd
import os
from PIL import Image
import sys
import json

# Read data from the parent process
data = sys.stdin.read()

# Parse the JSON data into a Python object
student = dict(json.loads(data))


nameLoc = (520, 525)
rollnoLoc = (520, 610)
branchLoc = (520, 690)
examinationLoc = (520, 775)
yearSemLoc = (520, 860)

courseCodeLoc1 = (260, 1070)
courseCodeLoc2 = (260, 1130)
courseCodeLoc3 = (260, 1190)
courseCodeLoc4 = (260, 1250)
courseCodeLoc5 = (260, 1310)
courseCodeLoc6 = (260, 1370)
courseCodeLoc7 = (260, 1430)
courseCodeLoc8 = (260, 1490)
courseCodeLoc9 = (260, 1550)
courseCodeLoc10 = (260, 1610)

courseTitleLoc1 = (450, 1070)
courseTitleLoc2 = (450, 1130)
courseTitleLoc3 = (450, 1190)
courseTitleLoc4 = (450, 1250)
courseTitleLoc5 = (450, 1310)
courseTitleLoc6 = (450, 1370)
courseTitleLoc7 = (450, 1430)
courseTitleLoc8 = (450, 1490)
courseTitleLoc9 = (450, 1550)
courseTitleLoc10 = (450, 1610)

creditsEarnedLoc1 = (670, 1070)
creditsEarnedLoc2 = (670, 1130)
creditsEarnedLoc3 = (670, 1190)
creditsEarnedLoc4 = (670, 1250)
creditsEarnedLoc5 = (670, 1310)
creditsEarnedLoc6 = (670, 1370)
creditsEarnedLoc7 = (670, 1430)
creditsEarnedLoc8 = (670, 1490)
creditsEarnedLoc9 = (670, 1550)
creditsEarnedLoc10 = (670, 1610)

totalCreditsLoc = (660, 1705)

gradeLoc1 = (800, 1070)
gradeLoc2 = (800, 1130)
gradeLoc3 = (800, 1190)
gradeLoc4 = (800, 1250)
gradeLoc5 = (800, 1310)
gradeLoc6 = (800, 1370)
gradeLoc7 = (800, 1430)
gradeLoc8 = (800, 1490)
gradeLoc9 = (800, 1550)
gradeLoc10 = (800, 1610)

gradePointerLoc1 = (952, 1070)
gradePointerLoc2 = (952, 1130)
gradePointerLoc3 = (952, 1190)
gradePointerLoc4 = (952, 1250)
gradePointerLoc5 = (952, 1310)
gradePointerLoc6 = (952, 1370)
gradePointerLoc7 = (952, 1430)
gradePointerLoc8 = (952, 1490)
gradePointerLoc9 = (952, 1550)
gradePointerLoc10 = (952, 1610)

cxgLoc1 = (1100, 1070)
cxgLoc2 = (1100, 1130)
cxgLoc3 = (1100, 1190)
cxgLoc4 = (1100, 1250)
cxgLoc5 = (1100, 1310)
cxgLoc6 = (1100, 1370)
cxgLoc7 = (1100, 1430)
cxgLoc8 = (1100, 1490)
cxgLoc9 = (1100, 1550)
cxgLoc10 = (1100, 1610)

totalCxgLoc = (1095, 1705)

sgpiLoc = (1100, 1785)

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

cv2.putText(template, str(student['Credit Earned']),
            creditsEarnedLoc1, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_1']),
            creditsEarnedLoc2, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_2']),
            creditsEarnedLoc3, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_3']),
            creditsEarnedLoc4, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_4']),
            creditsEarnedLoc5, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_5']),
            creditsEarnedLoc6, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_6']),
            creditsEarnedLoc7, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_7']),
            creditsEarnedLoc8, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_8']),
            creditsEarnedLoc9, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Credit Earned_9']),
            creditsEarnedLoc10, font, fontScale, color, thickness, lineType)

cv2.putText(template, str(student['Total Credits']),
            totalCreditsLoc, font, fontScale, color, thickness, lineType)

cv2.putText(template, student['Grade'], gradeLoc1,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_1'], gradeLoc2,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_2'], gradeLoc3,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_3'], gradeLoc4,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_4'], gradeLoc5,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_5'], gradeLoc6,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_6'], gradeLoc7,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_7'], gradeLoc8,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_8'], gradeLoc9,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, student['Grade_9'], gradeLoc10,
            font, fontScale, color, thickness, lineType)

cv2.putText(template, str(student['Grade Pointer']),
            gradePointerLoc1, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_1']),
            gradePointerLoc2, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_2']),
            gradePointerLoc3, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_3']),
            gradePointerLoc4, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_4']),
            gradePointerLoc5, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_5']),
            gradePointerLoc6, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_6']),
            gradePointerLoc7, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_7']),
            gradePointerLoc8, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_8']),
            gradePointerLoc9, font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['Grade Pointer_9']),
            gradePointerLoc10, font, fontScale, color, thickness, lineType)

cv2.putText(template, str(student['C X G']), cxgLoc1,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_1']), cxgLoc2,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_2']), cxgLoc3,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_3']), cxgLoc4,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_4']), cxgLoc5,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_5']), cxgLoc6,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_6']), cxgLoc7,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_7']), cxgLoc8,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_8']), cxgLoc9,
            font, fontScale, color, thickness, lineType)
cv2.putText(template, str(student['C X G_9']), cxgLoc10,
            font, fontScale, color, thickness, lineType)

cv2.putText(template, str(student['Total C X G']),
            totalCxgLoc, font, fontScale, color, thickness, lineType)

cv2.putText(template, str(student['SGPI']), sgpiLoc,
            font, fontScale, color, thickness, lineType)

rollno_name_sem = str(student['Roll No']) + '_' + \
    str(student['Name']) + '_Sem' + str(student['Sem'])
cwd = os.getcwd()

if not cv2.imwrite(fr'{cwd}\pyscript_certificate\results\{rollno_name_sem}.png', template):
    raise Exception("Could not write image!")
with Image.open(fr'{cwd}\pyscript_certificate\results\{rollno_name_sem}.png') as img:
    img.convert('RGB').save(
        fr'{cwd}\pyscript_certificate\results\{rollno_name_sem}.pdf', format='PDF', resolution=100.0)
os.remove(fr'{cwd}\pyscript_certificate\results\{rollno_name_sem}.png')
