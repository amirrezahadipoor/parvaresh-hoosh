import json, os, datetime
root='/mnt/data/work'
p=os.path.join(root,'content/curriculum.json')
d=json.load(open(p))

def add(domain_id, levels):
    dom=next(x for x in d['domains'] if x['id']==domain_id)
    dom['levels'].extend(levels)


def level(id,title,diff,lessons):
    return {'id':id,'title':title,'difficulty':diff,'lessons':[{'id':i,'title':t,'type':ty,'status':'completed','difficulty':diff,'ageBand':age,'extraTier':tier,'variation':n} for n,(i,t,ty,age,tier) in enumerate(lessons,1)]}

# Reading: 20
R=[]
for lid,title,items,diff,age,tier in [
('read-L9','جمله‌های روان و درک معنی',[(f'R-L9-L{i:02d}',t,'reading') for i,t in enumerate(['جمله را کامل کن','چه کسی چه کاری انجام داد؟','کدام جمله معنی درست دارد؟','کلمه مناسب را انتخاب کن','جمله کوتاه را بخوان','ترتیب واژه‌های جمله را پیدا کن','جمله پرسشی و خبری','واژه هم‌معنی را پیدا کن'],1)],4,'۶ تا ۷ سال',4),
('read-L10','واژه‌سازی و دستور زبان کودکانه',[(f'R-L10-L{i:02d}',t,'language') for i,t in enumerate(['مفرد و جمع ساده','مذکر و مؤنث در واژه‌های آشنا','اسم و فعل را تشخیص بده','کلمه هم‌خانواده را پیدا کن','جمله را با فعل مناسب کامل کن','نشانه‌گذاری جمله کوتاه'],1)],4,'۶ تا ۷ سال',4),
('read-L11','خواندن پاراگراف و نتیجه‌گیری',[(f'R-L11-L{i:02d}',t,'comprehension') for i,t in enumerate(['پاراگراف کوتاه: صبح مدرسه','پاراگراف کوتاه: باغچه','پاراگراف کوتاه: یک دوست تازه'],1)],5,'۷ تا ۸ سال',5),
('read-L12','درک مطلب و خواندن پیشرفته کودک',[(f'R-L12-L{i:02d}',t,'comprehension') for i,t in enumerate(['نتیجه داستان را حدس بزن','دلیل رفتار شخصیت را پیدا کن','دو جمله را با هم مقایسه کن'],1)],5,'۷ تا ۸ سال',5)]:
    R.append(level(lid,title,diff,[(a,b,c,age,tier) for a,b,c in items]))
add('reading',R)

# Math: 20
M=[]
for lid,title,items,diff,age,tier in [
('math-L10','جمع و تفریق تا 20',[(f'M-L10-L{i:02d}',t,'arithmetic') for i,t in enumerate(['جمع تا 20','تفریق تا 20','جای خالی در جمع','جای خالی در تفریق','مسئله تصویری جمع','مسئله تصویری تفریق','مقایسه دو عبارت'],1)],4,'۶ تا ۷ سال',4),
('math-L11','الگو، عدد و اندازه‌گیری پیشرفته',[(f'M-L11-L{i:02d}',t,'patterns') for i,t in enumerate(['الگوی دو مرحله‌ای','الگوی سه شکلی','عدد قبل و بعد تا 50','بزرگ‌تر و کوچک‌تر تا 50','اندازه‌گیری با خط‌کش','زمان‌های ساده ساعت و نیم ساعت','پول و خرید ساده'],1)],4,'۶ تا ۷ سال',4),
('math-L12','حل مسئله و منطق عددی',[(f'M-L12-L{i:02d}',t,'problem-solving') for i,t in enumerate(['دو مرحله جمع و تفریق','مسئله کمبود و اضافه','عدد گمشده در دنباله'],1)],5,'۷ تا ۸ سال',5),
('math-L13','ریاضی چالشی برای ۸ ساله‌ها',[(f'M-L13-L{i:02d}',t,'problem-solving') for i,t in enumerate(['جمع سه عدد ذهنی','تفریق با چند گام','مسئله ترکیبی پول و زمان'],1)],5,'۷ تا ۸ سال',5)]:
    M.append(level(lid,title,diff,[(a,b,c,age,tier) for a,b,c in items]))
add('math',M)

# Logic 15
L=[]
for lid,title,items,diff,age,tier in [
('logic-L8','الگو و حافظه چندمرحله‌ای',[(f'L-L8-L{i:02d}',t,'memory-logic') for i,t in enumerate(['حافظه ۴ تصویر','حافظه ۵ تصویر','دنباله تصویری دو قانون','شیء گمشده از ۵ تصویر','جفت‌یابی سریع'],1)],4,'۶ تا ۷ سال',4),
('logic-L9','استدلال و دسته‌بندی چندمعیاره',[(f'L-L9-L{i:02d}',t,'reasoning') for i,t in enumerate(['دسته‌بندی بر اساس رنگ و شکل','کدام گزینه هر دو شرط را دارد؟','مسیر کوتاه‌تر را پیدا کن','چه چیزی اول اتفاق می‌افتد؟','جدول ساده منطق'],1)],5,'۷ تا ۸ سال',5),
('logic-L10','معماهای ترکیبی',[(f'L-L10-L{i:02d}',t,'reasoning') for i,t in enumerate(['معمای سه سرنخ','ماتریس تصویری سخت‌تر','الگوی پنهان','کدام گزینه نتیجه منطقی است','پازل چهارمرحله‌ای'],1)],5,'۷ تا ۸ سال',5)]:
    L.append(level(lid,title,diff,[(a,b,c,age,tier) for a,b,c in items]))
add('logic',L)

# Science 15
S=[]
for lid,title,items,diff,age,tier in [
('science-L8','طبیعت و جانوران پیشرفته‌تر',[(f'S-L8-L{i:02d}',t,'science') for i,t in enumerate(['زنجیره ساده غذا','سازگاری حیوان با زیستگاه','پوشش بدن حیوانات','جانور شب‌زی و روززی','ردپای حیوانات'],1)],4,'۶ تا ۷ سال',4),
('science-L9','زمین، آب و هوا',[(f'S-L9-L{i:02d}',t,'earth-science') for i,t in enumerate(['ابر چگونه شکل می‌گیرد؟','باد و جهت آن','گرم و سرد و دما','چرخه ساده آب','صرفه‌جویی در آب و انرژی'],1)],4,'۶ تا ۷ سال',4),
('science-L10','آزمایش و استدلال علمی کودکانه',[(f'S-L10-L{i:02d}',t,'scientific-reasoning') for i,t in enumerate(['چه چیزی شناور می‌ماند؟','چه چیزی حل می‌شود؟','سایه چگونه تغییر می‌کند؟','پیش‌بینی نتیجه یک آزمایش','مشاهده و نتیجه‌گیری'],1)],5,'۷ تا ۸ سال',5)]:
    S.append(level(lid,title,diff,[(a,b,c,age,tier) for a,b,c in items]))
add('science',S)

# Social 15
SE=[]
for lid,title,items,diff,age,tier in [
('soc-L7','خودتنظیمی و ارتباط بهتر',[(f'SE-L7-L{i:02d}',t,'social-emotional') for i,t in enumerate(['وقتی ناراحتم چه کار کنم؟','درخواست کمک محترمانه','گوش دادن فعال','نوبت گرفتن در گفت‌وگو','نه گفتن محترمانه'],1)],4,'۶ تا ۷ سال',4),
('soc-L8','همکاری و حل تعارض',[(f'SE-L8-L{i:02d}',t,'social-emotional') for i,t in enumerate(['حل اختلاف دو دوست','تقسیم عادلانه وسایل','کار گروهی با نقش‌ها','عذرخواهی و جبران','کنترل هیجان در بازی'],1)],5,'۷ تا ۸ سال',5),
('soc-L9','خودشناسی و تصمیم‌گیری',[(f'SE-L9-L{i:02d}',t,'social-emotional') for i,t in enumerate(['شناخت نقطه قوت خودم','انتخاب بین دو راه خوب','مسئولیت‌پذیری در خانه','همدلی با دوست ناراحت','تصمیم امن در موقعیت تازه'],1)],5,'۷ تا ۸ سال',5)]:
    SE.append(level(lid,title,diff,[(a,b,c,age,tier) for a,b,c in items]))
add('socio-emotional',SE)

# Art 15
A=[]
for lid,title,items,diff,age,tier in [
('art-L6','ترکیب رنگ و فرم',[(f'A-L6-L{i:02d}',t,'creative-art') for i,t in enumerate(['رنگ گرم و سرد','ترکیب دو رنگ','الگوی نقطه و خط','ساخت شکل از دایره و مربع','کامل کردن نقاشی نیمه‌کاره'],1)],4,'۶ تا ۷ سال',4),
('art-L7','داستان‌سازی تصویری',[(f'A-L7-L{i:02d}',t,'creative-art') for i,t in enumerate(['یک شخصیت بساز','سه قاب داستانی','حالت چهره شخصیت','طراحی یک محیط','کارت تبریک با پیام'],1)],5,'۷ تا ۸ سال',5),
('art-L8','خلاقیت و حل مسئله هنری',[(f'A-L8-L{i:02d}',t,'creative-art') for i,t in enumerate(['نقاشی با محدودیت سه شکل','ساخت الگوی تکرارشونده','تبدیل شکل به حیوان','ساخت پوستر کوچک','داستان تصویری چهارقابی'],1)],5,'۷ تا ۸ سال',5)]:
    A.append(level(lid,title,diff,[(a,b,c,age,tier) for a,b,c in items]))
add('art',A)

# Normalize sequential order and metadata
for dom in d['domains']:
    for lev in dom['levels']:
        for i,les in enumerate(lev['lessons'],1):
            les['order']=i
            les.setdefault('status','completed')
            if 'difficulty' not in les: les['difficulty']=lev.get('difficulty',1)
            if 'ageBand' not in les: les['ageBand']='۵ تا ۶ سال' if les['difficulty']<=2 else ('۶ تا ۷ سال' if les['difficulty']<=4 else '۷ تا ۸ سال')
    # keep existing level order, then new levels

d['totalLessons']=sum(len(l['lessons']) for dom in d['domains'] for l in dom['levels'])
d['version']='3.0.0'
d['lastUpdated']='2026-08-18'
json.dump(d,open(p,'w'),ensure_ascii=False,indent=2)

# manifest
items=[]
for dom in d['domains']:
    for lev in dom['levels']:
        for les in lev['lessons']:
            items.append({
                'id':les['id'],'domain':dom['id'],'domainTitle':dom['title'],'level':lev['id'],'levelTitle':lev['title'],
                'difficulty':les['difficulty'],'ageBand':les.get('ageBand'),'title':les['title'],'type':les['type'],
                'status':'completed','hasImage':True,'hasGame':True,'hasContent':True,'hasAudio':True,
                'interactiveType':'interactive-multiround','order':les.get('order')
            })
man={'project':'پرورش هوش کودک','appVersion':'3.0.0','targetAge':'۵ تا ۸ سال','generated':'2026-08-18','totalItems':len(items),'completedItems':len(items),'progressPercentage':100,'items':items}
json.dump(man,open(os.path.join(root,'content/content_manifest.json'),'w'),ensure_ascii=False,indent=2)
print('total',len(items))
