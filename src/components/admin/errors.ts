import { ApiError } from "@/lib/data";

/** Shows a short Arabic explanation for a failed admin request. */
export function reportAdminError(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    alert("انتهت الجلسة، سجّل الدخول مرة أخرى");
    window.location.href = "/";
    return;
  }
  if (err instanceof ApiError && err.status === 503) {
    alert("قاعدة البيانات غير متصلة — تأكد من إضافة DATABASE_URL");
    return;
  }
  alert("حصل خطأ، حاول مرة أخرى");
}
