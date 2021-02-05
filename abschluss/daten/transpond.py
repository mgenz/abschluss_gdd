import pandas as pd

csv = pd.read_csv('co2.csv',  delimiter=';')

csv_reshape = pd.melt(csv, id_vars=['country'], value_vars=['iso'])

csv_reshape.to_csv("csv_reshaped.csv")

print(csv_reshape)



