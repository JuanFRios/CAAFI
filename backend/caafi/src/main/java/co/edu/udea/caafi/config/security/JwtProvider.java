package co.edu.udea.caafi.config.security;

import co.edu.udea.caafi.dto.user.RoleDto;
import co.edu.udea.caafi.model.user.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * JSON Web Token provider
 */
@Component
public class JwtProvider{

  private static final String ROLES_KEY = "roles";

  private final String secretKey;
  private final long validityInMilliseconds;

  /**
   * Constructor
   *
   * @param secretKey llave privada para la generación del token
   * @param validityInMilliseconds tiempo de validez del token en milisegundos
   */
  @Autowired
  public JwtProvider(@Value("${security.jwt.token.secret-key}") String secretKey,
                     @Value("${security.jwt.token.expiration}") long validityInMilliseconds) {

    this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    this.validityInMilliseconds = validityInMilliseconds;
  }

  /**
   * Create JWT string given username and roles.
   *
   * @param username usernname
   * @param roles roles list
   * @return jwt string
   */
  public String createToken(String username, List<Role> roles) {
    Claims claims = Jwts.claims().setSubject(username);
    claims.put(ROLES_KEY, roles.stream().map(role ->new SimpleGrantedAuthority(role.getAuthority()))
        .collect(Collectors.toList()));
    Date now = new Date();
    Date expiresAt = new Date(now.getTime() + validityInMilliseconds);
    return Jwts.builder()
        .setClaims(claims)
        .setIssuedAt(now)
        .setExpiration(expiresAt)
        .signWith(SignatureAlgorithm.HS256, secretKey)
        .compact();
  }

  /**
   * Create JWT string given username and roles.
   *
   * @param username usernname
   * @param roles roles list
   * @return jwt string
   */
  public String createTokenFromDto(String username, List<RoleDto> roles) {
    Claims claims = Jwts.claims().setSubject(username);
    claims.put(ROLES_KEY, roles.stream().map(role ->new SimpleGrantedAuthority(role.getCodigo()))
        .collect(Collectors.toList()));
    Date now = new Date();
    Date expiresAt = new Date(now.getTime() + validityInMilliseconds);
    return Jwts.builder()
        .setClaims(claims)
        .setIssuedAt(now)
        .setExpiration(expiresAt)
        .signWith(SignatureAlgorithm.HS256, secretKey)
        .compact();
  }

  /**
   * Validate the JWT String
   *
   * @param token JWT string
   * @return true if valid, false otherwise
   */
  public boolean isValidToken(String token) {
    try {
      Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  /**
   * Get the username from the token string
   *
   * @param token jwt
   * @return username
   */
  public String getUsername(String token) {
    return Jwts.parser().setSigningKey(secretKey)
        .parseClaimsJws(token).getBody().getSubject();
  }

  /**
   * Get the roles from the token string
   *
   * @param token jwt
   * @return username
   */
  public List<GrantedAuthority> getRoles(String token) {
    List<Map<String, String>> roleClaims = Jwts.parser().setSigningKey(secretKey)
        .parseClaimsJws(token).getBody().get(ROLES_KEY, List.class);
    return roleClaims.stream().map(roleClaim ->
        new SimpleGrantedAuthority(roleClaim.get("authority")))
        .collect(Collectors.toList());
  }
}
