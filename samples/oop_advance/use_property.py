class Screen(object):

    def __init__(self, width, height):
        self.__width = width
        self.__height = height

    @property
    def resolution(self):
        return self.__width * self.__height

# Test.
s = Screen(1024, 768)
print('resolution =', s.resolution)
if s.resolution == 786432:
    print('测试通过!')
else:
    print('测试失败!')        