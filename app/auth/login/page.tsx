function login() {
  return (
    <div>
      <div className="bg-surface border border-border-subtle rounded-card p-6 shadow-level1 font-arabic">
        {/* شارة حالة الموعد */}
        <span className="inline-block bg-primary-light text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
          متاح للحجز
        </span>

        <h3 className="text-neutral-primary text-lg font-bold mb-1">
          كشف استشاري
        </h3>
        <p className="text-neutral-muted text-sm mb-4">
          المدة: 30 دقيقة • عيادة التجمع
        </p>

        {/* زر الحجز الأساسي مع تفاعل الـ Hover */}
        <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-input transition-colors">
          تأكيد الموعد
        </button>

        {/* زر سداد العربون الذهبي */}
        <button className="w-full mt-2 bg-accent-gold hover:opacity-90 text-neutral-primary font-semibold py-2.5 rounded-input transition-opacity">
          دفع العربون عبر إنستاباي
        </button>
      </div>
    </div>
  );
}

export default login;
