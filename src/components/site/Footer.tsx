import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">EduVerse</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            منصة تعليمية احترافية متعددة الأكاديميات، تجمع نخبة المعلمين تحت سقف واحد بتجربة تعلم سينمائية حديثة.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">الأكاديميات</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>الرياضيات</li>
            <li>الفيزياء</li>
            <li>الكيمياء</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">المنصة</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>عن EduVerse</li>
            <li>المدونة</li>
            <li>تواصل معنا</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EduVerse. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
