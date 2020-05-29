d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
print('d ', d)

num = d['Michael']
print('num ', num)

d['Adam'] = 67

print('d ', d)

thomas = d.get('Thomsa', -1)
print('Thomas ', thomas)

removed = d.pop('Bob')
print('removed ', removed)
print('d ', d)