import { Injectable, computed, signal } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeAr);
registerLocaleData(localeEn);

export type Lang = 'ar' | 'en';

const KEY = 'nca_lang';

const AR: Record<string, string> = {
  'nav.home': 'الرئيسية',
  'nav.lessons': 'الدروس',
  'nav.grades': 'الدرجات',
  'nav.payments': 'المدفوعات',
  'nav.profile': 'ملفي',
  'app.toggleDark': 'تبديل الوضع الداكن',
  'app.logout': 'تسجيل الخروج',
  'app.switchLang': 'English / العربية',
  'app.changePassword': 'تغيير كلمة المرور',
  'app.currentPassword': 'كلمة المرور الحالية',
  'app.newPassword': 'كلمة المرور الجديدة',
  'app.save': 'حفظ',
  'app.saving': 'جارٍ الحفظ…',
  'app.cancel': 'إلغاء',
  'app.passChanged': 'تم تغيير كلمة المرور بنجاح.',
  'app.passFailed': 'تعذّر تغيير كلمة المرور.',
  'app.passHint': 'ستستخدم كلمة المرور الجديدة عند تسجيل الدخول في المرة القادمة.',
  'app.on': 'تشغيل',
  'app.off': 'إيقاف',

  'login.tagline': 'تعلّمك كله في مكان واحد.',
  'login.sub': 'شاهد دروس الفيديو، وتابع تقدّمك، واطّلع على درجاتك ومدفوعاتك — من أي جهاز.',
  'login.f1': 'دروس فيديو منظّمة حسب الوحدات',
  'login.f2': 'متابعة فورية للدرجات',
  'login.f3': 'تقدّمك المستمرّ واقتراح الدرس التالي',
  'login.title': 'تسجيل دخول الطالب',
  'login.welcome': 'أهلاً بعودتك! أدخل بياناتك للمتابعة.',
  'login.email': 'البريد الإلكتروني',
  'login.password': 'كلمة المرور',
  'login.signin': 'تسجيل الدخول',
  'login.signingin': 'جارٍ تسجيل الدخول…',
  'login.teacherOnly': 'المعلمون يستخدمون لوحة تحكم المعلم.',
  'login.failed': 'فشل تسجيل الدخول',

  'egp': 'ج.م',
  'payStatus.paid': 'مدفوع',
  'payStatus.unpaid': 'غير مدفوع',
  'payStatus.late': 'متأخّر',

  'dash.loading': 'جارٍ تحميل لوحة التحكم…',
  'dash.welcome': 'أهلاً بعودتك، {name} 👋',
  'dash.subtitle': 'لنواصل السلسلة!',
  'dash.payLine': 'دفعة شهر {month} — {status}',
  'dash.due': 'مستحق {amount} ج.م',
  'dash.details': 'التفاصيل',
  'dash.progress': 'التقدّم في الدورة',
  'dash.watched': 'دروس مكتملة',
  'dash.modules': 'الوحدات',
  'dash.counts': 'أكملت {a} من أصل {b} دروساً',
  'dash.next': 'الدرس التالي',
  'dash.watchNow': 'شاهد الآن',
  'dash.recent': 'أحدث الدرجات',
  'dash.viewAll': 'عرض الكل',
  'dash.noGrades': 'لا توجد درجات بعد — عد لاحقاً.',
  'dash.top3': 'أفضل 3 طلاب',
  'dash.top3Sub': 'حسب مجموع النقاط',

  'tbl.title': 'العنوان',
  'tbl.type': 'النوع',
  'tbl.score': 'الدرجة',
  'tbl.subject': 'المادة',
  'tbl.date': 'التاريخ',
  'tbl.points': 'النقاط',
  'tbl.feedback': 'الملاحظات',
  'tbl.month': 'الشهر',
  'tbl.amount': 'المبلغ',
  'tbl.status': 'الحالة',
  'tbl.paidOn': 'تاريخ السداد',

  'exam': 'امتحان',
  'homework': 'واجب',

  'lessons.loading': 'جارٍ تحميل الدروس…',
  'lessons.subtitle': 'أكمل كل وحدة وعلّم الدروس كمكتملة.',
  'lessons.watched': 'تمت المشاهدة',
  'lessons.markWatched': 'علّم كمكتملة',
  'lessons.moduleCount': 'تمت مشاهدة {a} / {b}',
  'lessons.toggleWatched': 'تبديل حالة الدرس «{title}»',
  'lessons.empty': 'لا توجد دروس متاحة بعد. اطلب من معلمك نشرها.',
  'lessons.takeQuiz': 'اختبر معلوماتك',
  'lessons.takeQuizHint': 'أجب عن الأسئلة بعد مشاهدة الدرس.',
  'lessons.backToLesson': 'العودة إلى الدرس',

  'grades.loading': 'جارٍ تحميل الدرجات…',
  'grades.subtitle': 'أداؤك في الامتحانات والواجبات والاختبارات بنظرة واحدة.',
  'grades.examsAvg': 'متوسط الامتحانات',
  'grades.homeworkAvg': 'متوسط الواجبات',
  'grades.quizAvg': 'متوسط الاختبارات',
  'grades.exams': 'الامتحانات',
  'grades.homework': 'الواجبات',
  'grades.quizzes': 'اختبارات الدروس',
  'grades.noExams': 'لا توجد امتحانات بعد.',
  'grades.noHomework': 'لا توجد واجبات بعد.',
  'grades.noQuizzes': 'لا توجد اختبارات بعد — اختبر معلوماتك بعد مشاهدة الدروس.',
  'grades.lesson': 'الدرس',

  'quiz.noQuiz': 'لا يوجد اختبار لهذا الدرس بعد.',
  'quiz.loading': 'جارٍ تحميل الاختبار…',
  'quiz.question': 'السؤال {n} من أصل {t}',
  'quiz.submit': 'إرسال الإجابات',
  'quiz.submitting': 'جارٍ الإرسال…',
  'quiz.score': 'نتيجتك: {s} من أصل {t}',
  'quiz.pass': 'أحسنت! اجتزت الاختبار',
  'quiz.fail': 'راجع الدرس ثم أعد المحاولة.',
  'quiz.correct': 'إجابتك صحيحة',
  'quiz.wrong': 'إجابة غير صحيحة — الصحيح: {a}',
  'quiz.tryAgain': 'إعادة المحاولة',
  'quiz.attemptsLeft': 'المحاولات المتبقية: {n}',
  'quiz.bestScore': 'أفضل نتيجة: {s} من أصل {t} ({p}%)',
  'quiz.noAttemptsLeft': 'استهلكت كل المحاولات المتاحة لهذا الاختبار.',

  'grades.points': 'النقاط',
  'grades.totalPoints': 'مجموع النقاط',
  'grades.pointsOutOf': '{e} من أصل {p} نقطة',
  'grades.examsPoints': 'نقاط الامتحانات',
  'grades.homeworkPoints': 'نقاط الواجبات',
  'grades.quizPoints': 'نقاط الاختبارات',

  'payments.loading': 'جارٍ تحميل المدفوعات…',
  'payments.subtitle': 'حالة الرسوم وسجل المدفوعات.',
  'payments.allSet': 'كل شيء سليم لشهر {month} 🎉',
  'payments.paidOnDate': 'تم سداد {amount} ج.م بتاريخ {date}',
  'payments.paidOnNoDate': 'تم سداد {amount} ج.م',
  'payments.dueLine': 'دفعة شهر {month} — {status}',
  'payments.cash': 'المبلغ {amount} ج.م — ادفع نقداً لمعلمك ليُعتمد السداد.',
  'payments.noRecord': 'لا يوجد سجل دفع لشهر {month}',
  'payments.ask': 'اسأل معلمك إن كانت لديك أي استفسارات.',
  'payments.history': 'السجل',
  'payments.noHistory': 'لا يوجد سجل مدفوعات بعد.',

  'landing.badge': 'التعليم الثانوي · البرمجة',
  'landing.h1a': 'تعلّم',
  'landing.h1b': 'البرمجة',
  'landing.h1c': 'بذكاء',
  'landing.sub': 'دروس فيديو منظّمة، واختبارات بتغذية راجعة فورية، ونظام نقاط — تنافس زملاءك على قائمة أفضل 5.',
  'landing.ctaStudent': 'دخول الطالب',
  'landing.features.title': 'كل شيء في مكان واحد',
  'landing.f1.title': 'دروس فيديو',
  'landing.f1.desc': 'وحدات منظّمة تشاهدها بوتيرتك الخاصة، وتعلّم ما أنجزته كدرس مكتمل.',
  'landing.f2.title': 'اختبارات وامتحانات',
  'landing.f2.desc': 'اختبر نفسك باختبارات تُحتسب أفضل محاولة فيها، وامتحانات بدرجات حقيقية.',
  'landing.f3.title': 'نقاط وقائمة الأوائل',
  'landing.f3.desc': 'اجمع نقاطاً من الامتحانات والاختبارات والواجبات، وارتقِ في قائمة الأفضل.',
  'landing.leaderboard.title': 'أفضل 5 هذا الفصل',
  'landing.leaderboard.sub': 'حسب مجموع النقاط في الامتحانات والاختبارات والواجبات.',
  'landing.leaderboard.pts': '{e} نقطة',
  'landing.leaderboard.loading': 'جارٍ تحميل القائمة…',
  'landing.leaderboard.empty': 'لا توجد نتائج بعد — كن أول من يحجز مكانه!',
  'landing.leaderboard.error': 'تعذّر تحميل قائمة الأوائل حالياً.',
  'landing.footer': '© {year} أكاديمية نيو كود',

  'dash.announcements': 'الإعلانات',
  'dash.seeProfile': 'ملفي',
  'dash.tip': '💡 نصيحة اليوم',

  'tips.t0': 'قسّم أهدافك الكبيرة إلى دروس يومية صغيرة — انتظامك أهم من الحماس.',
  'tips.t1': 'دوّن ملاحظاتك أثناء مشاهدة الدرس ولخّصها بأسلوبك.',
  'tips.t2': 'أنهِ الاختبار مباشرة بعد الدرس لتثبيت المعلومة.',
  'tips.t3': '30 دقيقة مركّزة كل يوم أفضل من 3 ساعات مرةً في الأسبوع.',
  'tips.t4': 'استخدم وضع التدريب على الأسئلة التي أخطأت فيها.',
  'tips.t5': 'سلسلة الأيام تُبنى بخطوة صغيرة كل يوم — لا تُفوّت يومك!',

  'ann.none': 'لا توجد إعلانات حالياً.',

  'profile.subtitle': 'شاراتك ومستواك وسلسلة أيامك في مكان واحد.',
  'profile.level': 'المستوى {n}',
  'profile.points': 'النقاط',
  'profile.nextLevel': '{p} نقطة للمستوى التالي',
  'profile.badges': 'الشارات',
  'profile.earnedCount': '{n} شارة مُكتسَبة',
  'profile.lockedHint': 'استمر في التعلم لكسب ما تبقّى!',
  'profile.avatar': 'الصورة الرمزية',
  'profile.avatarHint': 'اختر رمزاً يمثلك — يُحفظ على حسابك.',
  'profile.streakCard': 'سلسلة الأيام',
  'profile.longest': 'الأطول',
  'profile.today': 'اليوم',
  'profile.weekly': 'هدف أسبوعك',
  'profile.weeklyProgress': '{a} من أصل {b} دروس هذا الأسبوع',
  'profile.heatmap': 'النشاط',
  'profile.heatmapHint': 'كل مربع يمثل يوماً درستَ فيه — كلما أغمق اللون زاد عدد الدروس.',
  'profile.newBadge': '🎉 شارة جديدة!',
  'profile.newBadgeMsg': 'كسبت شارة «{b}»',
  'profile.sound': 'الأصوات',
  'profile.soundHint': 'مؤثرات صوتية خفيفة عند الإنجازات',
  'profile.notifications': 'إشعارات المتصفح',
  'profile.notificationsHint': 'تنبيه عند صدور إعلان جديد أو كسر السلسلة',
  'profile.notifDenied': 'فعّل الإشعارات من إعدادات المتصفح لألّا تفوّت الإعلانات.',
  'profile.notifGranted': 'الإشعارات مفعّلة ✓',
  'profile.avatarSaved': 'حُفظت الصورة الرمزية.',
  'profile.notes': 'ملاحظاتي',
  'profile.notesCount': '{n} ملاحظة',

  'notes.title': 'ملاحظاتي',
  'notes.placeholder': 'اكتب ملاحظاتك حول هذا الدرس…',
  'notes.save': 'حفظ الملاحظة',
  'notes.saved': 'حُفظت الملاحظة.',

  'lessons.roadmap': 'خارطة الطريق',
  'lessons.current': 'أنت هنا',
  'lessons.resume': 'استكمال من {t}',
  'lessons.startOver': 'من البداية',
  'lessons.openNotes': 'ملاحظات',

  'quiz.explanation': 'شرح',
  'quiz.practiceNote': 'وضع التدريب — لا يُحتسب كمحاولة',
  'quiz.practiceWrong': 'تدريب: الأسئلة الخاطئة',
  'quiz.practiceWrongHint': 'أعد حل الأسئلة التي أخطأت فيها فقط.',
  'quiz.practiceDone': 'أتقنت الأسئلة التي أخطأت فيها!',
  'quiz.practiceRemaining': 'لا توجد أسئلة خاطئة — إجابة مثالية!',

  'notif.annTitle': 'إعلان جديد 🌟',
  'notif.streakTitle': 'حافظ على سلسلتك 🔥',
  'notif.streakBody': 'لم تدرس اليوم بعد — لا تدع سلسلة أيامك تنكسر!',

  'onboard.title': 'لنبدأ معاً 🚀',
  'onboard.hint': 'أكمل هذه الخطوات السريعة لتحصل على أفضل تجربة.',
  'onboard.dismiss': 'تخطَّ الآن',
};

const EN: Record<string, string> = {
  'nav.home': 'Home',
  'nav.lessons': 'Lessons',
  'nav.grades': 'Grades',
  'nav.payments': 'Payments',
  'nav.profile': 'Profile',
  'app.toggleDark': 'Toggle dark mode',
  'app.logout': 'Log out',
  'app.switchLang': 'Switch to Arabic',
  'app.changePassword': 'Change password',
  'app.currentPassword': 'Current password',
  'app.newPassword': 'New password',
  'app.save': 'Save',
  'app.saving': 'Saving…',
  'app.cancel': 'Cancel',
  'app.passChanged': 'Password changed successfully.',
  'app.passFailed': 'Could not change the password.',
  'app.passHint': 'You will use the new password next time you sign in.',
  'app.on': 'On',
  'app.off': 'Off',

  'login.tagline': 'Your learning, all in one place.',
  'login.sub': 'Watch video lessons, track your progress, check your grades, and manage your payments — from any device.',
  'login.f1': 'Structured video lessons per module',
  'login.f2': 'Real-time grade tracking',
  'login.f3': 'Progress, streaks, and next-lesson picks',
  'login.title': 'Student sign in',
  'login.welcome': 'Welcome back! Enter your details to continue.',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.signin': 'Sign in',
  'login.signingin': 'Signing in…',
  'login.teacherOnly': 'Teachers should use the Teacher Dashboard.',
  'login.failed': 'Login failed',

  'egp': 'EGP',
  'payStatus.paid': 'Paid',
  'payStatus.unpaid': 'Unpaid',
  'payStatus.late': 'Late',

  'dash.loading': 'Loading your dashboard…',
  'dash.welcome': 'Welcome back, {name} 👋',
  'dash.subtitle': "Let's keep the streak going!",
  'dash.payLine': 'Payment {status} for {month}',
  'dash.due': '{amount} EGP due',
  'dash.details': 'Details',
  'dash.progress': 'Course progress',
  'dash.watched': 'Lessons watched',
  'dash.modules': 'Modules',
  'dash.counts': '{a} of {b} lessons completed',
  'dash.next': 'Next lesson',
  'dash.watchNow': 'Watch now',
  'dash.recent': 'Recent grades',
  'dash.viewAll': 'View all',
  'dash.noGrades': 'No grades yet — check back soon.',
  'dash.top3': 'Top 3 students',
  'dash.top3Sub': 'by total points',

  'tbl.title': 'Title',
  'tbl.type': 'Type',
  'tbl.score': 'Score',
  'tbl.subject': 'Subject',
  'tbl.date': 'Date',
  'tbl.points': 'Points',
  'tbl.feedback': 'Feedback',
  'tbl.month': 'Month',
  'tbl.amount': 'Amount',
  'tbl.status': 'Status',
  'tbl.paidOn': 'Paid on',

  'exam': 'Exam',
  'homework': 'Homework',

  'lessons.loading': 'Loading lessons…',
  'lessons.subtitle': 'Work through each module and mark lessons as watched.',
  'lessons.watched': 'Watched',
  'lessons.markWatched': 'Mark watched',
  'lessons.moduleCount': '{a} / {b} watched',
  'lessons.toggleWatched': 'Toggle watched for {title}',
  'lessons.empty': 'No lessons are available yet. Ask your teacher to publish them.',
  'lessons.takeQuiz': 'Test your knowledge',
  'lessons.takeQuizHint': 'Answer a few questions after you finish the video.',
  'lessons.backToLesson': 'Back to lesson',

  'grades.loading': 'Loading grades…',
  'grades.subtitle': 'Your exams, homework and lesson quizzes at a glance.',
  'grades.examsAvg': 'Exams average',
  'grades.homeworkAvg': 'Homework average',
  'grades.quizAvg': 'Quiz average',
  'grades.exams': 'Exams',
  'grades.homework': 'Homework',
  'grades.quizzes': 'Lesson quizzes',
  'grades.noExams': 'No exams yet.',
  'grades.noHomework': 'No homework yet.',
  'grades.noQuizzes': 'No quizzes yet — test yourself after watching lessons.',
  'grades.lesson': 'Lesson',

  'quiz.noQuiz': 'No quiz for this lesson yet.',
  'quiz.loading': 'Loading quiz…',
  'quiz.question': 'Question {n} of {t}',
  'quiz.submit': 'Submit answers',
  'quiz.submitting': 'Submitting…',
  'quiz.score': 'Your score: {s} of {t}',
  'quiz.pass': 'Well done! You passed the quiz',
  'quiz.fail': 'Review the lesson and try again.',
  'quiz.correct': 'Correct',
  'quiz.wrong': 'Wrong — correct answer: {a}',
  'quiz.tryAgain': 'Try again',
  'quiz.attemptsLeft': 'Attempts left: {n}',
  'quiz.bestScore': 'Best score: {s} of {t} ({p}%)',
  'quiz.noAttemptsLeft': 'You have used all 2 attempts for this quiz.',

  'grades.points': 'Points',
  'grades.totalPoints': 'Total points',
  'grades.pointsOutOf': '{e} / {p} pts',
  'grades.examsPoints': 'Exam points',
  'grades.homeworkPoints': 'Homework points',
  'grades.quizPoints': 'Quiz points',

  'payments.loading': 'Loading payments…',
  'payments.subtitle': 'Tuition status and payment history.',
  'payments.allSet': 'All set for {month} 🎉',
  'payments.paidOnDate': '{amount} EGP paid on {date}',
  'payments.paidOnNoDate': '{amount} EGP paid',
  'payments.dueLine': 'Payment {status} for {month}',
  'payments.cash': '{amount} EGP — pay in cash to your teacher to get marked as paid.',
  'payments.noRecord': 'No payment record for {month}',
  'payments.ask': 'Ask your teacher if you have any questions.',
  'payments.history': 'History',
  'payments.noHistory': 'No payment history yet.',

  'landing.badge': 'Secondary School · Programming',
  'landing.h1a': 'Learn',
  'landing.h1b': 'programming',
  'landing.h1c': 'the smart way',
  'landing.sub': 'Structured video lessons, quizzes with instant feedback, and a points system — take on your classmates in the top-5 leaderboard.',
  'landing.ctaStudent': 'Student sign in',
  'landing.features.title': 'Everything in one place',
  'landing.f1.title': 'Video lessons',
  'landing.f1.desc': 'Work through structured modules at your own pace and mark lessons as watched.',
  'landing.f2.title': 'Quizzes & exams',
  'landing.f2.desc': 'Test yourself with quizzes (your best attempt counts) and real graded exams.',
  'landing.f3.title': 'Points & leaderboard',
  'landing.f3.desc': 'Earn points from exams, quizzes and homework, then climb to the top 5.',
  'landing.leaderboard.title': 'Top 5 this term',
  'landing.leaderboard.sub': 'Measured by total points across exams, quizzes and homework.',
  'landing.leaderboard.pts': '{e} pts',
  'landing.leaderboard.loading': 'Loading the leaderboard…',
  'landing.leaderboard.empty': 'No rankings yet — be the first to claim a spot!',
  'landing.leaderboard.error': "Couldn't load the leaderboard right now.",
  'landing.footer': '© {year} New Code Academy',

  'dash.announcements': 'Announcements',
  'dash.seeProfile': 'My profile',
  'dash.tip': '💡 Tip of the day',

  'tips.t0': 'Break big goals into small daily lessons — consistency beats bursts.',
  'tips.t1': 'Take notes while you watch and summarize in your own words.',
  'tips.t2': 'Take the quiz right after the lesson to lock it in.',
  'tips.t3': '30 focused minutes daily beats 3 hours once a week.',
  'tips.t4': 'Use practice mode on the questions you missed.',
  'tips.t5': 'Streaks are built one small step a day — don\'t miss yours!',

  'ann.none': 'No announcements yet.',

  'profile.subtitle': 'Your badges, level and streak — all in one place.',
  'profile.level': 'Level {n}',
  'profile.points': 'Points',
  'profile.nextLevel': '{p} pts to next level',
  'profile.badges': 'Badges',
  'profile.earnedCount': '{n} earned',
  'profile.lockedHint': 'Keep learning to unlock the rest!',
  'profile.avatar': 'Avatar',
  'profile.avatarHint': 'Pick an emoji to represent you — saved to your account.',
  'profile.streakCard': 'Streak',
  'profile.longest': 'Longest',
  'profile.today': 'Today',
  'profile.weekly': 'Weekly goal',
  'profile.weeklyProgress': '{a} of {b} lessons this week',
  'profile.heatmap': 'Activity',
  'profile.heatmapHint': 'Each square is a day you studied — the darker, the more lessons.',
  'profile.newBadge': '🎉 New badge!',
  'profile.newBadgeMsg': 'You earned the badge "{b}"',
  'profile.sound': 'Sounds',
  'profile.soundHint': 'Light sound effects on achievements',
  'profile.notifications': 'Browser notifications',
  'profile.notificationsHint': 'Get alerted on new announcements or a broken streak',
  'profile.notifDenied': 'Enable notifications in your browser settings to never miss announcements.',
  'profile.notifGranted': 'Notifications on ✓',
  'profile.avatarSaved': 'Avatar saved.',
  'profile.notes': 'My notes',
  'profile.notesCount': '{n} notes',

  'notes.title': 'My notes',
  'notes.placeholder': 'Write your notes about this lesson…',
  'notes.save': 'Save note',
  'notes.saved': 'Note saved.',

  'lessons.roadmap': 'Course roadmap',
  'lessons.current': 'You are here',
  'lessons.resume': 'Resume from {t}',
  'lessons.startOver': 'From the start',
  'lessons.openNotes': 'Notes',

  'quiz.explanation': 'Explanation',
  'quiz.practiceNote': 'Practice mode — doesn\'t count as an attempt',
  'quiz.practiceWrong': 'Practice: missed questions',
  'quiz.practiceWrongHint': 'Retry only the questions you missed.',
  'quiz.practiceDone': 'You nailed the questions you missed!',
  'quiz.practiceRemaining': 'No missed questions — perfect score!',

  'notif.annTitle': 'New announcement 🌟',
  'notif.streakTitle': 'Keep your streak alive 🔥',
  'notif.streakBody': "You haven't studied today yet — don't let your streak break!",

  'onboard.title': 'Let\'s get started 🚀',
  'onboard.hint': 'Complete these quick steps to get the best experience.',
  'onboard.dismiss': 'Skip for now',
};

function mapOf(dict: Record<string, string>): Map<string, string> {
  return new Map(Object.entries(dict));
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.stored() === 'en' ? 'en' : 'ar');
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));

  private dict = mapOf(this.lang() === 'ar' ? AR : EN);

  constructor() {
    this.apply();
  }

  private stored(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  private apply() {
    this.dict = mapOf(this.lang() === 'ar' ? AR : EN);
    document.documentElement.lang = this.lang();
    document.documentElement.dir = this.dir();
    try {
      localStorage.setItem(KEY, this.lang());
    } catch {
      /* ignore */
    }
  }

  toggle() {
    this.lang.set(this.lang() === 'ar' ? 'en' : 'ar');
    this.apply();
  }

  t(key: string, params?: Record<string, string | number>): string {
    const str = this.dict.get(key) ?? key;
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (match, k: string) => String(params[k] ?? match));
  }

  payStatus(status: string) {
    return this.t(`payStatus.${status}`);
  }
}