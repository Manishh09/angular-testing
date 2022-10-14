import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesSerivice', ()=> {

    let courseServ: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule // includes the mock impl of http service
            ],
            providers: [
               CoursesService,
            ]
        });
        courseServ = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should return all the courses', () => {

        courseServ.findAllCourses().subscribe(
            courses  => {
                expect(courses).toBeTruthy('No course is returned');
                expect(courses.length).toBeGreaterThan(0);
            }
        );
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        expect(req.flush({
            payload: Object.values(COURSES) // mock data
        }));
    })
    it('should return course by id', () => {

        const courseId= 12;
        courseServ.findCourseById(courseId).subscribe(
            course  => {
                expect(course).toBeTruthy('No course is returned');
                expect(course.id).toBe(12, 'Incorrect Id');
            }
        );
        const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
        expect(req.request.method).toEqual('GET');
        expect(COURSES[12]) // mock data
    }
    );
    it('should save courses', () => {

        const changes: Partial<Course> = {titles: { description: 'description'}};
        const courseId= 12;
        courseServ.saveCourse(courseId, changes).subscribe(
            course  => {
                expect(course).toBeTruthy('No course is returned');
                expect(course.id).toBe(12, 'Incorrect Id');
            }
        );
        const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual('description');

        req.flush({...COURSES[12], ...changes}) // mock data
    }
    );
    it('should save courses fail', () => {

        const changes: Partial<Course> = {titles: { description: 'description'}};
        const courseId= 12;
        courseServ.saveCourse(12, changes).subscribe(
            course  => fail('Save courses should have failed'),
            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );
        const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
        expect(req.request.method).toEqual('PUT');
        

        req.flush('Save courses failed!', {status: 500, statusText: 'Internal Server Error'}) // mock data
    }
    );
    it('should get lessons for courses', () => {

        const changes: Partial<Course> = {titles: { description: 'description'}};

        courseServ.findLessons(12).subscribe(
            lesson  => {
                expect(lesson).toBeTruthy();
                expect(lesson.length).toBeGreaterThan(0);
            }
        );
        const req = httpTestingController.expectOne(req => req.url === `/api/lessons`);
        expect(req.request.method).toEqual('GET');

        expect(req.request.params.get('courseId')).toEqual('12')
        expect(req.request.params.get('filter')).toEqual('')
        expect(req.request.params.get('sortOrder')).toEqual('asc')
        expect(req.request.params.get('pageNumber')).toEqual('0')
        expect(req.request.params.get('pageSize')).toEqual('3')

        req.flush({
            payload: findLessonsForCourse(12).slice(0,3)
        }) // mock data
    }
    );

    afterEach(() =>{
        httpTestingController.verify(); // ensures '/api/courses' endpoint wil get called only once by the service that is being tested
    })
})
    