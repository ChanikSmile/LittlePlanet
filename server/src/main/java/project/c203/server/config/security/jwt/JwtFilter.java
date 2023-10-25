package project.c203.server.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import project.c203.server.member.dto.MemberResponse;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = getParseJwt(request.getHeader("Authorization"));
            if (token != null && jwtUtils.validateToken(token)) {
                Authentication auth = jwtUtils.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException | MalformedJwtException | SignatureException e) {
            // JWT 관련 예외에 대한 응답 처리
            handleErrorResponse(response, HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            // 기타 예외에 대한 응답 처리
            handleErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private void handleErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        MemberResponse error = new MemberResponse(false, message);
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(error));
    }

    private String getParseJwt(final String headerAuth) {
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer")) {
            return headerAuth.substring(7);
        }
        return null;
    }

}
