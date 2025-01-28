import { LessonActions } from "@/components/lesson-actions";
import { LessonQuiz } from "@/components/lesson-quiz";
import { LessonVideo } from "@/components/lesson-video";
import { ILesson } from "@/types";

async function getLessons(courseId: string, lessonId: string) {
    const res = await fetch(`https://coursee.ai/api/v1/courses/${courseId}/lessons/${lessonId}`, {
        cache: 'no-store',
        headers: {
            'x-api-key': process.env.COURSEE_API_KEY || ''
        }
    });

    const data = await res.json();

    const lessonsRes = await fetch(`https://coursee.ai/api/v1/courses/${courseId}/lessons`, {
        cache: 'no-store',
        headers: {
            'x-api-key': process.env.COURSEE_API_KEY || ''
        }
    });

    const lessonsData = await lessonsRes.json();

    if (!data.success) {
        throw new Error(data.message);
    }

    return { lesson: data.data, lessons: lessonsData.data || { total: 0, results: [] } };
}

export default async function LessonPage({ params }: { params: { courseId: string; lessonId: string; }; }) {
    const { lesson, lessons } = await getLessons(params.courseId, params.lessonId);
    const currentLessonIdx = (lessons.results || []).findIndex((l: ILesson) => l.id === lesson.id) || 0;

    return (
        <div className="max-w-screen-lg mx-auto p-5 md:p-8">
            <div className="flex item-center justify-between gap-5 flex-wrap">
                <div className="flex flex-col gap-1">
                    <p className="text-gray-500">Lesson {currentLessonIdx + 1} of {lessons.total}</p>
                    <h2 className="text-2xl md:text-3xl font-bold">{lesson.name}</h2>
                </div>
                <LessonActions lessons={lessons} />
            </div>

            <LessonVideo lesson={lesson} />

            <LessonQuiz lesson={lesson} />

            {/* Lesson Additional Text */}
            <div
                className="prose lg:prose-lg max-w-none mt-8"
                dangerouslySetInnerHTML={{ __html: lesson.additionalText }} />
        </div>
    );
};