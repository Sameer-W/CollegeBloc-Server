import cv2
import pandas as pd

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

df = pd.read_excel(
    r'C:/Users/Sameer/Documents/2023 Web/Express/CollegeBloc-server/uploads/data.xlsx')

for i in df.index:
    template = cv2.imread('template.png')
    cv2.putText(template, df['Name'][i], nameLoc, font,
                fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Roll No'][i]), rollnoLoc,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, df['Branch'][i], branchLoc,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Examination'][i]).strip(
    ), examinationLoc, font, fontScale, color, thickness, lineType)
    cv2.putText(template, df['Year and Semester'][i],
                yearSemLoc, font, fontScale, color, thickness, lineType)

    cv2.putText(template, df['Course code 1'][i], courseCodeLoc1,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 2'][i], courseCodeLoc2,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 3'][i], courseCodeLoc3,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 4'][i], courseCodeLoc4,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 5'][i], courseCodeLoc5,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 6'][i], courseCodeLoc6,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 7'][i], courseCodeLoc7,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 8'][i], courseCodeLoc8,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 9'][i], courseCodeLoc9,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course code 10'][i], courseCodeLoc10,
                font, smallFontScale, color, thickness, lineType)

    cv2.putText(template, df['Course Title'][i], courseTitleLoc1,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.1'][i], courseTitleLoc2,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.2'][i], courseTitleLoc3,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.3'][i], courseTitleLoc4,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.4'][i], courseTitleLoc5,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.5'][i], courseTitleLoc6,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.6'][i], courseTitleLoc7,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.7'][i], courseTitleLoc8,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.8'][i], courseTitleLoc9,
                font, smallFontScale, color, thickness, lineType)
    cv2.putText(template, df['Course Title.9'][i], courseTitleLoc10,
                font, smallFontScale, color, thickness, lineType)

    cv2.putText(template, str(df['Marks'][i]), marksLoc1,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.1'][i]), marksLoc2,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.2'][i]), marksLoc3,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.3'][i]), marksLoc4,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.4'][i]), marksLoc5,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.5'][i]), marksLoc6,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.6'][i]), marksLoc7,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.7'][i]), marksLoc8,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.8'][i]), marksLoc9,
                font, fontScale, color, thickness, lineType)
    cv2.putText(template, str(df['Marks.9'][i]), marksLoc10,
                font, fontScale, color, thickness, lineType)

    rollno_name = str(df['Roll No'][i]) + '_' + str(df['Name'][i])
    if not cv2.imwrite(fr'C:\Users\Sameer\Documents\2023 Web\Express\CollegeBloc-server\pyscript_certificate\results', template):
        raise Exception("Could not write image!")
    # cv2.imshow('View', template)
    # cv2.waitKey(0)
    print("Processing Certificate {}/{}".format(i+1, len(df.index)))
