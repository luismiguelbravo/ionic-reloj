import { TestBed } from '@angular/core/testing';
import { ContadorService } from './contador.service';
describe('ContadorService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(ContadorService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=contador.service.spec.js.map