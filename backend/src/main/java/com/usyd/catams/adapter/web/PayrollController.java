package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.TutorIncomeDetailDTO;
import com.usyd.catams.application.query.PayrollQueryService;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import com.usyd.catams.infrastructure.exception.UnauthorizedException;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Tutor / HR 工资收入接口
 * 已由 AuthInterceptor 校验 Token。
 */
@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollQueryService payrollQueryService;

    /**
     * 查询月度收入（Tutor 自己或 HR 查询全体）
     */
    @GetMapping("/income/monthly")
    public ApiResponse<?> getMonthlyIncome(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Long tutorId
    ) {
        var user = AuthUserContext.get();

        // 默认当前月份 yyyy-MM
        String targetMonth = (month != null)
                ? month
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        return switch (user.getRole()) {
            case "Tutor" -> ApiResponse.ok(payrollQueryService.getMonthlyIncomeByTutor(user.getId(), targetMonth));
            case "HR" -> ApiResponse.ok(payrollQueryService.getMonthlyIncomeAll(tutorId, targetMonth));
            default -> throw new UnauthorizedException("Permission denied: only Tutor or HR can access payroll data");
        };
    }

    /**
     * 查询月度收入明细（Tutor 自己或 HR 查询全体）
     */
    @GetMapping("/income/detail")
    public ApiResponse<List<TutorIncomeDetailDTO>> getMonthlyIncomeDetail(
            @RequestParam String month,
            @RequestParam(required = false) Long tutorId
    ) {
        var user = AuthUserContext.get();

        return switch (user.getRole()) {
            case "Tutor" -> ApiResponse.ok(payrollQueryService.getMonthlyIncomeDetailByTutor(user.getId(), month));
            case "HR" -> ApiResponse.ok(payrollQueryService.getMonthlyIncomeDetailAll(tutorId, month));
            default -> throw new UnauthorizedException("Permission denied: only Tutor or HR can access payroll detail");
        };
    }

    // Tutor 年度收入趋势
    @GetMapping("/income/yearly")
    public ApiResponse<?> getYearlyIncome(
            @RequestParam String year
    ) {
        var user = AuthUserContext.get();

        return ApiResponse.ok(payrollQueryService.getYearlyIncomeByTutor(user.getId(), year));
    }
}
